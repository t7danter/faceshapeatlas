# Geometric analysis methodology

This is an exploratory, uncalibrated rule-based classifier. MediaPipe detects landmarks; it does not classify face shapes. No accuracy, medical, beauty, identity or sensitive-attribute claims are made.

## Landmark map

Indices refer to the official MediaPipe 478-point topology (468 face points plus 10 iris points). Selected points were cross-checked against the official face oval connectivity in `FaceLandmarker.FACE_LANDMARKS_FACE_OVAL` and the [canonical face model](https://github.com/google-ai-edge/mediapipe/blob/master/mediapipe/modules/face_geometry/data/canonical_face_model.obj). The 468-point topology's selected indices are retained in the 478-point model.

| Measurement | Indices | Interpretation |
| --- | --- | --- |
| Visible length | 10 → 152 | Upper facial contour to chin; not verified hairline-to-chin |
| Cheekbone region width | 234 → 454 | Outer lateral facial contour proxy |
| Upper-face width | 103 → 332 | Temple/upper-contour proxy; always labeled estimated |
| Jaw width | 172 → 397 | Lower lateral outline |
| Left contour angle | 132 → 172 → 148 | Angle at 172, not a clinical gonial angle |
| Right contour angle | 361 → 397 → 377 | Angle at 397 |
| Symmetry pairs | 33/263, 234/454, 172/397, 103/332 | Paired outline and outer-eye landmarks |

The overlay uses the exact source image dimensions as its SVG viewBox. Both SVG and image have identical displayed bounds, so responsive resizing preserves alignment without cropping or stretching.

## Normalization and formulas

For image width W and height H, transform landmarks `(x,y,z)` to `(x,y H/W,z)` before geometry. This fixes the anisotropy of separately image-normalized x and y. Distance is Euclidean in this two-dimensional isotropic plane. z is retained for diagnostics but does not masquerade as calibrated depth.

Let L = distance(10,152), C = distance(234,454), U = distance(103,332), J = distance(172,397). Return L/C, C/J, U/C and J/C. No physical units are inferred. J/C and C/J are reciprocals, not independent features in scoring.

For the angle at B between A and C, use `acos(dot(A-B,C-B) / (|A-B| |C-B|))`. Average the left and right contour angles. Reject degenerate geometry.

For symmetry, reflect each left point across the 10→152 line, measure its distance to its right partner, average those distances and divide by C. Display as a percentage of C, not a beauty or symmetry score. Withhold the indicator if |yaw| or |pitch| exceeds 5°. Natural asymmetry, model error and perspective all contribute.

## Shape scoring

The feature vector is `[L/C, U/C, J/C, angle]`. Scales are `[0.18, 0.12, 0.12, 24°]`; weights are `[0.42,0.22,0.26,0.10]`. For each prototype, cost = sum(weight × ((feature − target)/scale)²), and score = round(100 × exp(−cost)). Scores are independent rule matches, not a softmax or probabilities.

| Shape | L/C | U/C | J/C | Angle |
| --- | --- | --- | --- | --- |
| Oval | 1.38 | .88 | .77 | 148° |
| Round | 1.15 | .89 | .82 | 151° |
| Square | 1.20 | .95 | .90 | 128° |
| Heart | 1.34 | .98 | .70 | 143° |
| Diamond | 1.38 | .77 | .72 | 142° |
| Oblong | 1.65 | .90 | .80 | 146° |

These initial engineering prototypes are not anthropometric population norms. Synthetic tests verify each prototype, scale/translation invariance, boundaries and weak matches; they do not establish real-world accuracy. Primary and secondary labels are always returned. A gap below 8 points or best score below 55 is flagged mixed/ambiguous. Manual selection changes recommendations, not automatic measurements or scores.

## Quality gates

- `numFaces: 2` detects a second face so multiple faces are rejected rather than silently selecting one. Detection and presence thresholds: 0.6.
- Selected landmarks must exist and be finite. Face width must be at least 18% of image width and 140 analysis pixels. Outline landmarks must remain inside a 1.5% border.
- MediaPipe's landmark-fitted face transformation matrix supplies pose. Uniform scale is normalized out before column-major Euler extraction. Initial limits: |yaw|, |pitch|, |roll| ≤10°. If a transform is absent or invalid, reject rather than guess.
- Markedly imbalanced nose-to-cheek distances (min/max <0.55) reject likely pose/visibility problems.
- Crop the face region and resize to 256 px wide. Luminance is .2126 R + .7152 G + .0722 B; reject mean <40 or >235. Laplacian variance below 18 rejects severe blur. These conservative heuristics require broader calibration and can respond to skin tone, texture and lighting.
- A mandatory user check confirms the full face is unobstructed. **This is not robust automatic occlusion detection.** MediaPipe may hallucinate points behind coverings; the user is told to reject misaligned overlays.

## Limits and calibration work

No real user photographs are stored as fixtures. Runtime QA uses a public MediaPipe sample only in the ignored `.local/` folder. Synthetic tests are not a demographic validation dataset. Before making accuracy claims, evaluate an independently consented and diverse dataset, report confusion/ambiguity and rejection rates, and calibrate thresholds without conflating styling categories with scientific classes.
