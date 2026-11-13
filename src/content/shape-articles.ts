import type { FaceShape } from '../config';

type ShapeArticle = {
  description: string;
  summary: string;
  snapshot: string;
  check: string[];
  comparisonTitle: string;
  compare: { shape: FaceShape; text: string }[];
  hair: { title: string; text: string }[];
  glasses: string[];
  example: { name: string; text: string; url: string; source: string };
  nextStep: string;
};

export const shapeArticles: Record<FaceShape, ShapeArticle> = {
  heart: {
    description: 'Recognize a heart face shape by comparing the temples, cheeks and jaw. See how it differs from diamond and find hairstyle and glasses ideas.',
    summary: 'The upper face holds more width, while the jaw narrows toward the chin. A widow’s peak is optional. Start with the taper, then check where the width sits.',
    snapshot: 'Look for a broad upper outline and a noticeably narrower jaw. Check the temples as well as the cheekbones: a pointed chin alone can occur in several shapes.',
    check: [
      'Look straight into a mirror with your hair held loosely away from the sides. Start at the temples and follow the edge down past the cheeks. A heart outline tends to keep more width through the upper part and lose it below the cheeks. The chin may look rounded or pointed; what matters is the change in width along the way. Pulling your hair back tightly can distort the soft skin around the temples, so use a loose band or clips instead.',
      'On a photo, compare three horizontal spans: the temples, the widest part of the cheeks, and the sides of the jaw just above its turn toward the chin. The jaw should look appreciably narrower than the upper spans. The temples can be about as wide as the cheeks or a little narrower. The distinction is the upper face looks broad as a whole. If all the width is concentrated in a single band at the cheeks, put diamond on your shortlist.',
      'Now compare visible face length with cheekbone width. A heart outline can be short or moderately long; length alone is a weak signal here. You may see people describe a heart face as an inverted triangle. Both descriptions emphasize upper width and lower taper, and people use the terms differently. If you are choosing frames or a haircut, your observations about where the face narrows are more useful than settling the terminology.',
      'Do a second check if the forehead seems very wide in a selfie. Hold the camera at eye level and move farther away; crop the image afterward if you need a larger view. Keep the jaw relaxed and compare both sides. A raised lens can enlarge the upper face and make the chin recede. A part, a widow’s peak or a short fringe can also change the visible silhouette without changing the underlying proportions.',
    ],
    comparisonTitle: 'Heart vs. diamond and oval',
    compare: [
      { shape: 'diamond', text: 'Both can have a narrow chin. The deciding clue is the change from cheeks to temples. Diamond usually shows a clearer inward step above the cheekbones as well as below them. Try covering the tip of your chin on the photo and comparing the upper outlines. If the widest band still stands out around the cheeks, explore diamond too.' },
      { shape: 'oval', text: 'Both can narrow toward the chin. Oval usually tapers more gently, so the cheeks, temples and jaw look closer in width. A more noticeable contrast between the upper face and the jaw is the useful heart clue. If you see an even, gradual curve rather than a distinct change below the cheeks, oval may describe the photo better.' },
    ],
    hair: [
      { title: 'Chin-length texture for movement near the jaw', text: 'A bob with lightly textured ends puts some movement beside the narrowest part of the outline. Try it tucked behind one ear and loose on the other before deciding how much volume you want. If your hair springs up as it dries, ask your stylist to place the ends using its dry length. An endpoint that looks level with the jaw when wet may land at the cheeks once dry.' },
      { title: 'Side parts and fringe you can test first', text: 'A side sweep draws a diagonal across the upper face and can make a broad forehead feel less prominent in the overall look. Make a temporary side part while your hair is damp and see how it settles. A longer fringe is easier to pin back if you prefer an open forehead on some days. For a short cut, a relaxed side-swept top can give you the same effect without committing to bangs.' },
      { title: 'Long layers that start lower', text: 'If you like your length, ask where the shortest layer will sit when styled. A layer that ends below the cheek can bring movement toward the jaw; layers that spring up near the temples will emphasize the upper width. Both effects can look intentional. Show your stylist where you would like the ends to land and how you usually dry your hair rather than asking for a generic heart-face haircut.' },
    ],
    glasses: [
      'Compare a slim oval or rounded rectangle with a bolder browline frame of similar width. A light upper rim lets the top of the face stay visually open; a thicker brow adds definition if you want to highlight that area. Pay attention to where the lower rim ends. Slightly deeper lenses can bring attention downward, provided the frame clears your cheeks when you smile.',
      'Check the bridge before judging the style. Look straight ahead, then look down and turn your head: the frame should sit without sliding or relying on tight temples. Compare two frames using a straight-on photo at the same distance, so lens perspective does not make one look wider. An optician can help assess frame sizing and lens requirements for your prescription.',
    ],
    example: {
      name: 'Reese Witherspoon',
      text: 'For the 2013 Oscars, hairstylist Renato Campora styled Witherspoon’s hair with a side part and waves. Notice how one side stays relatively open while the sweep adds movement on the other. You can test the part and the placement of the wave before changing your haircut.',
      url: 'https://www.allure.com/gallery/reese-witherspoon-red-carpet-beauty-team',
      source: 'Campora’s interview with Allure',
    },
    nextStep: 'If you are undecided between heart and diamond, write down which area looks widest before opening the tool. Compare that observation with the estimated temple width and jaw width in the overlay. Hair obscuring the temples is a good reason to retake the photo rather than trust a small difference between scores.',
  },
  oval: {
    description: 'Learn how to recognize an oval face shape, compare it with oblong and diamond, and choose haircuts and glasses by the effect you want.',
    summary: 'An oval outline is moderately longer than wide, with its greatest width near the cheeks and a gentle taper toward the chin.',
    snapshot: 'Compare the whole curve. An oval face usually narrows a little from the cheekbones toward both the temples and jaw, without a sharp change of direction at either point.',
    check: [
      'Begin with length and width. On a level photo, compare the vertical span from the upper visible face to the chin with the horizontal span across the cheekbones. An oval outline usually looks longer than it is wide, but the length does not dominate the first impression. If you have to squint to tell the difference between the spans, consider round as well. If length is what you notice first from several feet away, compare oblong.',
      'Look for a gradual curve from temple to cheek and from cheek to chin. The cheekbones can be the broadest region without projecting sharply beyond the other widths. The jaw has some taper, but it does not need to be narrow or pointed. You can have a defined chin with an oval outline. Check the sides of the jaw, where you can tell whether they turn gradually inward or keep their width and form a more abrupt corner.',
      'Compare the temples with the jaw rather than judging your forehead by its height. A high hairline or a center part can make the top of a face look longer, while hair tucked behind the ears can make the cheeks easier to see. These are useful styling observations, but they do not replace the comparison of widths. The detector estimates upper-face width at the temples and does not identify a hairline.',
      'Try the comparison twice: once in a mirror and once in an eye-level photo taken from farther back than a close selfie. Keep your mouth relaxed. If one photo seems very narrow or long, look for a change in camera angle, a shadow along one cheek or hair hiding one side. Start from what you can see consistently. A small variation in length or width can move a result between two neighboring categories.',
    ],
    comparisonTitle: 'Oval vs. oblong and diamond',
    compare: [
      { shape: 'oblong', text: 'Check whether the length stands out more than the taper. An oblong outline looks longer relative to its cheekbone width and often stays more parallel along the sides. An oval outline tends to curve in earlier toward the lower face. The comparison is gradual: a long oval can show traits of both, and a head tilt can make the distinction harder.' },
      { shape: 'diamond', text: 'An oval and a diamond outline can both be widest at the cheeks. In a diamond outline the cheeks look more prominent relative to the temples and jaw. Trace the side of each outline with your eye. A pronounced inward change above and below the cheeks points toward diamond; a softer, more even curve is the oval clue.' },
    ],
    hair: [
      { title: 'Short cuts that change how much outline you see', text: 'A short crop or pixie can reveal the cheek-to-jaw curve, especially when the sides stay close to the head. Ask how much length you can leave on top if you like to vary the silhouette. Combing a longer top forward changes the upper edge; lifting it adds height. Take photos of both versions with your normal glasses or earrings so you can compare the whole look.' },
      { title: 'A bob with ends placed for your goal', text: 'A chin-length bob can bring attention to the jaw, while a longer bob can draw the eye down past it. To choose between them, clip the ends of your current hair at two lengths and stand back from the mirror. Look at the line of the ends against your chin and shoulders. If the line feels too strong, a softer perimeter or a little movement at the ends can change it without adding many layers.' },
      { title: 'Long layers that preserve your texture', text: 'If you want movement without losing the weight at the ends, ask for face-framing pieces and a fuller perimeter. Decide whether you want the shortest pieces to brush the cheeks or to fall below the jaw. Those positions bring attention to different parts of the face. A middle part reads more evenly across both sides; an off-center part can keep that outline while letting your hair follow its natural fall.' },
    ],
    glasses: [
      'Start with two styles in roughly the same size, such as a softened rectangle and a rounded frame. Rectangles add a horizontal line across a smoothly tapered outline. An oval or rounded frame repeats some of the face’s curves. Use a consistent lens width and similar rim thickness during the comparison; otherwise you may be reacting to the size or weight of the frame more than its shape.',
      'Try a deeper frame if you like more visual presence, then check it in profile and while smiling. The bottom edge should not be pushed up by your cheeks. Compare the top rim with your brows and note whether the bridge sits level. A frame that looks balanced in a still photo may fit poorly during the day. Give fit priority and ask an optician about the lens depth your prescription needs.',
    ],
    example: {
      name: 'Emma Watson',
      text: 'Watson’s 2011 Vogue profile shows how a close pixie leaves the cheeks and jaw visible. When you look at the cut, notice the direction of the top and the amount of hair left around the ears. Both details are useful to discuss with a stylist, regardless of how you describe your face.',
      url: 'https://www.vogue.com/article/emma-watsons-new-day',
      source: 'Watson’s Vogue interview',
    },
    nextStep: 'If oval and oblong both sound right, check visible length against cheekbone width, then look at the lower contour on the overlay. The two scores are useful for comparing the fit to this tool’s outlines. Choose whichever guide gives you more useful ideas for the feature you want to emphasize.',
  },
  round: {
    description: 'Identify a round face shape by checking length, cheek width and jaw curve. Compare it with square or oval, and explore haircuts and glasses.',
    summary: 'A round outline has relatively close length and width and a gradual turn below the cheeks. Compare the jaw curve before you settle on a match.',
    snapshot: 'The cheeks are often the widest region. From there the outline curves continuously toward the chin rather than holding a broad, straight jaw edge.',
    check: [
      'Set a mirror at eye level or take a straight-on photo with a relaxed mouth. Compare the length of the visible face with the span across the cheeks. A round outline tends to feel compact, with neither dimension much more prominent than the other. The two spans do not need to match exactly. Compare them using the same scale, such as marks on a copy of the photo, rather than comparing a tape held against your skin with a flat photo measurement.',
      'Pay particular attention to the line beneath the cheekbone. Does it make a smooth turn from the sides into the lower jaw, or can you see a defined corner below the ear? Round is more likely when the change in direction is gradual. The chin can still have a clear tip. Shape describes the outer line from one side to the other, and cheek fullness or a smile alone does not tell you which line you have.',
      'Check the width near the temples and the lower jaw. On many round outlines the cheeks stand out slightly from both. If the jaw stays close to the same width as the cheeks down to a pronounced corner, consider square. If the jaw narrows steadily and the face is clearly longer than it is wide, compare oval. Keep the hair away from the sides during this check; a full haircut beside the cheeks can make it harder to see the actual outline.',
      'For a second view, move the camera back and avoid a lens aimed up from below your chin. Lens distance changes the relative size of features at different distances from the camera, and a turned head can hide one cheek. If your mouth was open or your face tilted in the first picture, try a neutral photo before deciding that the proportions changed. Choose an outline that makes sense across more than one view.',
    ],
    comparisonTitle: 'Round vs. square and oval',
    compare: [
      { shape: 'square', text: 'Length and width can be close in both shapes. Compare the sides of the jaw with the cheekbone span, then look for the turn toward the chin. A broad lower face with a defined corner favors square; a narrower, smoother curve favors round. Try checking both sides, because shadows from a single light can create a hard-looking edge on only one side.' },
      { shape: 'oval', text: 'Both can have smooth curves. Oval usually has more visible length relative to its cheekbone width and a longer taper toward the chin. Hold your photo upright at arm’s length: if the outline looks elongated after you account for the hair and ears, compare oval. If it stays compact with a gentle curve beneath the cheeks, round may be the better description.' },
    ],
    hair: [
      { title: 'Put the ends where you want the focus', text: 'A collarbone-length bob can create a line below the widest part of the cheeks. A cut that ends at cheek level emphasizes that part of the face. Try tucking and untucking the same side of your hair to see how the outline changes. For curls, ask where the ends land when dry; the same cut can sit at different points depending on how much the curl springs up.' },
      { title: 'Try direction before you cut layers', text: 'For a little contrast, move your part off center or lift the hair at the crown and compare it with a flatter shape. Height can add a vertical line while a sweeping part draws the eye diagonally. If you prefer a short cut, try a textured top with less volume directly beside the cheeks. If you prefer to emphasize a rounded silhouette, keeping soft side volume can work just as well.' },
      { title: 'Keep longer pieces easy to wear', text: 'Ask your stylist to show where the front pieces land when you wear your hair loose and when you tie it up. Pieces that skim below the cheek can frame the jaw without putting all the width at the sides. Long, flat layers may require more effort to add lift, so mention your usual styling time and whether your hair falls forward on its own.' },
    ],
    glasses: [
      'Try a rectangle or a frame with a defined top edge if you want contrast with a soft jaw. A small upsweep can shift attention toward the temples, while a rounded rim can echo the face’s curve. Keep the sizes similar when comparing. A large frame can dominate a compact outline regardless of lens shape, and a frame with very small lenses can feel tight even if its hinge-to-hinge width is right.',
      'Smile with each frame on. The bottom rim should clear the cheeks, and your eyes should sit comfortably inside the lenses. Check from the side that the temples follow your head without splaying or pinching. Adjustable nose pads may offer a different fit from a fixed bridge. A useful shortlist includes one frame with a sharper line and another with softer corners so you can compare the effect in normal light.',
    ],
    example: {
      name: 'Selena Gomez',
      text: 'At the 2025 Rare Beauty Mental Health Summit, stylist Marissa Marino gave Gomez’s lob a center part and a sleek finish. The straight sections beside the cheeks and the longer edge of the cut are the details to study if you want a clearer vertical line. You can try the direction with your existing length first.',
      url: 'https://www.allure.com/story/selena-gomez-sleek-lob',
      source: 'Allure’s event photos',
    },
    nextStep: 'If you are between round and square, pay attention to the jaw line and contour in the overlay rather than reading the top score alone. If the face looks longer in one image than in your mirror, repeat the photo from farther away before comparing the two guides.',
  },
  square: {
    description: 'Compare forehead, cheek and jaw widths to recognize a square face shape. See how it differs from round and oblong, with hair and eyewear ideas.',
    summary: 'A square outline carries width lower down the face, often with a visible turn from the sides of the jaw toward the chin.',
    snapshot: 'Look for similar upper-face, cheekbone and jaw widths. The lower edge can be defined even when the chin itself is rounded.',
    check: [
      'Find the broadest part of your cheeks in an eye-level photo, then look at the sides of your jaw slightly below the ears. On a square outline, the jaw tends to keep much of that width before turning toward the chin. You may see a short, relatively straight segment on each side. Compare both sides with your mouth relaxed: clenching changes the visible lower face, and a shadow under one cheek can make the edge appear stronger.',
      'Compare the width at the temples with the cheekbone and jaw spans. A square outline often shows little difference across these three regions, though they rarely line up exactly. If the jaw is the widest by a clear margin or the upper area is hidden, record what you can see rather than trying to force a match. Moving hair away from your temples and ears helps distinguish the silhouette of your face from the silhouette of your haircut.',
      'Length still matters. A square face is allowed to be longer than it is wide; the name describes the proportions and the turn of the jaw, not a literal four-sided outline. If the length looks prominent even with your head level and the sides stay fairly parallel, compare oblong. Conversely, if the face looks compact but the lower contour blends into the chin without a visible turn, round may be a more useful description.',
      'Check your observation in a second photo under softer light. Use a neutral expression and give the camera enough distance that the nearest features do not dominate the image. A low angle can make the lower face look bigger. A beard, the edge of a collar or hair beside the chin may cover the exact area you need to compare. Use the part of the outline that is visible and allow for uncertainty.',
    ],
    comparisonTitle: 'Square vs. round and oblong',
    compare: [
      { shape: 'round', text: 'Both can look nearly as wide as they are long. The jaw is the more useful distinction. A square outline tends to stay wide farther below the cheeks and turn more visibly toward the chin. A round outline turns more continuously. Compare where the curve begins, rather than deciding based only on whether your chin looks pointed.' },
      { shape: 'oblong', text: 'An oblong outline can also have a defined jaw. Compare the full visible length with the cheekbone span. If the sides feel elongated and the length stands out, oblong may describe it better. A broadly angular outline with less visible length fits square more closely. In between, you can use both sets of suggestions.' },
    ],
    hair: [
      { title: 'Soften the edge or make it the focus', text: 'Soft waves that cross the level of the jaw can interrupt a straight edge. A crisp bob ending at the jaw does the opposite: it brings that shape into focus. Before cutting, pin the ends to the length you are considering, first with a straight finish and then with some bend. Compare the effect from straight ahead and slightly to the side.' },
      { title: 'Place shorter pieces with care', text: 'If you want movement without giving up length, try a few front layers that land below the corner of the jaw. Ask your stylist to show how the layers look when you tuck your hair and when it is loose. For wavy or curly hair, check where the shortest piece sits once dry. It may move higher than expected and put volume in a different place.' },
      { title: 'Change the part before changing the cut', text: 'A loose side part can draw an angled line across the upper face, while a centered part can emphasize an even outline. With a cropped style, a textured top adds a different line from the defined jaw below. Try both a neat finish and a looser one with your usual glasses on. Bring the photo you prefer to a consultation as a reference for shape and movement.' },
    ],
    glasses: [
      'Compare an oval frame with a rounded rectangle. The oval offers a continuous line against an angular jaw; the rounded rectangle keeps a clear top edge with less emphasis at the corners. A narrow rim changes the amount of contrast as much as the lens outline does. Try a stronger rim if you prefer to echo your angles. Compare frames in a similar color before deciding which shape you prefer.',
      'Stand far enough from the mirror to see the width of the frame against the cheeks. The frame should sit level at the bridge, with the temples resting comfortably rather than pressing inward. Check the bottom edge while you smile. If you like a shape that does not fit, ask to see it in another width or bridge size before discarding the silhouette.',
    ],
    example: {
      name: 'Keira Knightley',
      text: 'A Vogue street-style photograph shows Knightley with loose, air-dried waves and sunglasses. Notice the changes in direction along the hair beside her face. If you like that contrast, try letting a wave cross the jaw level instead of styling all the movement at the ends.',
      url: 'https://www.vogue.com/article/keira-knightley-hairstyles-air-dried-waves-sunglasses',
      source: 'Vogue’s photographed look',
    },
    nextStep: 'If the jaw is the most distinctive feature in your mirror, turn on the face outline and jaw measurement line in your result. Compare how much width remains at the jaw and whether the camera can see the lower contour clearly. If the widths are close but the edge is soft, look at the round guide as well.',
  },
  diamond: {
    description: 'Learn how to spot a diamond face shape, distinguish it from heart and oval, and explore hair and glasses ideas that work with prominent cheekbones.',
    summary: 'The cheekbones form the broadest part of the outline. Both the temple area and the jaw are visibly narrower.',
    snapshot: 'Check for narrowing in both directions from the cheeks. A narrow chin paired with a broad upper face may point toward heart instead.',
    check: [
      'Look for the widest part of your outline in a level, straight-on view. Diamond usually places this span around the cheekbones. Then move your attention up toward the temples and down toward the jaw. The outline should pull inward in both directions, rather than staying about as wide above the cheeks as it does at the cheeks. Make sure you are comparing the sides of the face and excluding the ears or hair from the width.',
      'The forehead comparison is often the deciding step. Tuck or clip hair away from the temples without stretching the skin. Look at the sides near the brow and above the outer cheeks. A narrow strip of visible forehead between two pieces of hair does not establish that the upper face is narrow. The tool uses temple landmarks as an estimate, so a fringe or heavy shadows can make this distinction less reliable even when you can see the cheeks clearly.',
      'Next compare the jaw width with cheekbone width. The diamond pattern usually includes a lower face that narrows noticeably below the cheeks. The chin may be pointed, but it can also have a softer tip. A prominent cheekbone highlight or hollow shadow is not the same thing as width. Try diffused light from the front and look at the actual outer edge rather than following makeup, highlights or cheek contours inside the face.',
      'Face length can be moderate or more pronounced. A long photo is not enough to pick diamond: you still need the difference between cheek width and the spans above and below. Compare two shots at eye level if your first one exaggerates the cheeks. Move farther from the lens, keep your face centered, and check whether the width pattern persists. If it changes when you tilt or turn, prioritize the straight view.',
    ],
    comparisonTitle: 'Diamond vs. heart and oval',
    compare: [
      { shape: 'heart', text: 'Both can narrow toward the chin. The temples are the key comparison. In heart, the upper area keeps more of the width seen across the cheeks. In diamond, there is a more distinct narrowing above the cheekbones. Hide the chin on a copy of the photo and compare the top half alone if a pointed chin keeps drawing your eye.' },
      { shape: 'oval', text: 'The cheekbones can be the widest point in both. With oval the transition to the temples and jaw tends to be gradual, and the widths are closer together. Diamond shows a stronger peak at the cheeks. If the difference is subtle, check whether you actually see a change of outline or just a brighter patch of light on the cheek.' },
    ],
    hair: [
      { title: 'Keep cheekbones visible with a light fringe', text: 'An open curtain fringe or a light side sweep can add movement near the temples without hiding the cheeks. Clip a front piece to roughly the length you are considering and see where it falls after you move your head. Ask for longer ends if you want to tuck the pieces behind your ears. A fringe that curves outward near the temples reads differently from one that ends at the broadest part of the cheeks.' },
      { title: 'Try a bob that gives the jaw some movement', text: 'With a narrow lower face, textured ends near or below the chin can bring attention to the jaw. A tucked side can leave one cheekbone exposed. If you wear curls or waves, decide how much width you want the dry shape to have at its ends. A cut that is fuller right at cheek level can highlight the widest point instead, which may be exactly the look you want.' },
      { title: 'Use a short cut or pulled-back style to show the outline', text: 'A short crop with a little texture over the temples gives a different outline from a very tight side cut. If you like a pulled-back look, try changing only the part or loosening the hair near the temples before cutting. Take two photos from the same distance so you can see whether you prefer a fuller upper silhouette or the stronger cheekbone emphasis of a slick finish.' },
    ],
    glasses: [
      'Try a light browline frame or a soft cat-eye if you want the upper rim to draw attention upward. An oval shape can follow the transition from cheek to jaw without introducing more angles. Keep the size consistent while comparing. A narrow top rim may feel smaller even when the temples fit, while a pronounced outer corner can create more visible width at the brow.',
      'Check how the frame sits where the cheekbones project most. Smile, look down and view the frame from the side: the lower rim should not lift or rock when your cheeks move. A frame with a different bridge height or adjustable pads can change the clearance. Choose a size that fits before deciding whether you want a bolder top edge or a lighter outline.',
    ],
    example: {
      name: 'Zendaya',
      text: 'Zendaya’s hairstylist Larry Sims described her close pixie look at the 2015 Grammys in Allure’s retrospective. The small amount of hair beside the cheeks makes the outline easy to see. Use it as a reference if you want your haircut to reveal that area; study the cut and placement rather than trying to copy the exact silhouette.',
      url: 'https://www.allure.com/gallery/zendaya-hair-evolution',
      source: 'Sims’s comments and the event photo',
    },
    nextStep: 'If the cheeks look widest but the temple estimate seems uncertain, make a fresh photo with both temples visible and compare the overlay with your first image. A similar diamond and heart score is a reason to read both guides. The style ideas are still useful even when the shape label remains mixed.',
  },
  oblong: {
    description: 'Recognize an oblong face shape by comparing visible length and width. Learn how it differs from oval and square, with haircuts and glasses to try.',
    summary: 'An oblong outline looks distinctly longer than it is wide. Its sides may stay relatively even in width, and the jaw can be rounded or angular.',
    snapshot: 'Start with visible length relative to the cheekbone span. A narrow-looking chin or a high hairline alone does not establish an oblong shape.',
    check: [
      'In a straight-on image, compare the vertical span from the visible upper face to the chin with the horizontal span across the outer cheeks. If the length is the first thing you notice even after ignoring the height of your hair, oblong is worth comparing. Keep the spans in the same photo and at the same scale. There is no universal ratio that separates a long oval from an oblong outline.',
      'Trace both sides from the temples to the jaw. An oblong outline often keeps more width along the sides than a strongly tapered shape. The jaw might look rounded, squared off or somewhere between. If the jaw curves inward gradually and the face only looks moderately longer than wide, oval may describe it better. If the lower face is broad and angular, compare square as well and see whether vertical length still stands out.',
      'Check the top of the photo. Hair volume, a tall part or an exposed hairline can change how long the silhouette looks. The tool measures visible landmarks and estimates the width near the temples; it does not extend the face measurement into the hairstyle. If your upper face is covered, base your visual comparison on what is visible and avoid treating the resulting number as a precise measurement.',
      'Use a second photo if the camera was above or below eye level. Straighten the image only if the frame itself was tilted; editing the crop cannot correct a head turned away from the lens. Step back and center the face, then compare the length-to-width impression again. If two photos show very different proportions, camera angle or distance may explain more than the difference between the two closest shape labels.',
    ],
    comparisonTitle: 'Oblong vs. oval and square',
    compare: [
      { shape: 'oval', text: 'Both outlines can be longer than wide. Compare how strongly length stands out and how early the sides start narrowing toward the chin. Oval often has a moderate length and a gradual taper. Oblong often looks longer with more parallel sides. Long oval and oblong can overlap, so choose the description that helps you decide where to place visual width.' },
      { shape: 'square', text: 'Both can have a visible jaw corner and similar widths across the forehead area, cheeks and jaw. In oblong the vertical span tends to dominate the overall shape. Square looks more compact in comparison. Look at the full face from farther back before judging only the jaw. A closely cropped photo can make a longer face seem more square.' },
    ],
    hair: [
      { title: 'Put volume beside the face', text: 'If you want the outline to look less vertical, try texture at the sides rather than adding most of the height at the crown. Loose bends near the cheek or jaw can create that effect. Clip a few sections while they dry and compare with a smoother version before choosing a cut. A stylist can help place the fullest section where your natural texture will support it.' },
      { title: 'Consider a fringe that fits your routine', text: 'A fringe can introduce a horizontal line near the forehead. Try a longer curtain fringe if you prefer the option to pin it back, or a softer full fringe if you want more coverage. Check your hair’s natural direction and how often you are willing to restyle it. When working with curls, ask to see how the dry length relates to your brows and frames.' },
      { title: 'Break up a long straight line with the ends', text: 'A textured shoulder-length cut can add width near the lower face. If you prefer long hair, try a bend or a layer near the jaw rather than changing all the length. If you prefer a close cut, leave some texture at the sides and compare a low top with a taller one. A taller silhouette is also a valid choice if you want to emphasize length.' },
    ],
    glasses: [
      'Compare a deeper rounded rectangle with a shallow rectangle of the same width. The deeper lenses take up more vertical space within the face and can interrupt a long outline. An upper rim with visible width can add a horizontal line. Choose how much definition you want: a lighter color can keep a deeper frame understated, while a dark rim makes its outline more apparent.',
      'Check the deeper frame while you smile and move your head. It should stay clear of your cheeks and sit securely on the bridge. A frame with more lens height is only useful if it fits, and lens design can influence which sizes are suitable. If one shape gives you the look you want but sits low, compare a different bridge or nose pad fit with an optician.',
    ],
    example: {
      name: 'Sarah Jessica Parker',
      text: 'Vogue’s retrospective on Carrie Bradshaw’s hair shows Parker with long curls and with a shorter cut styled by Serge Normant. Compare where the sides expand on each look. You can use the contrast to decide whether you want movement beside the cheek, at the jaw or below the shoulders.',
      url: 'https://www.vogue.com/article/sex-and-the-city-carrie-bradshaw-hair-evolution',
      source: 'Vogue’s retrospective and interview',
    },
    nextStep: 'If you suspect oblong, inspect visible length divided by cheekbone width before looking at the jaw angle. Compare your result with a second straight photo if the top of the face was cropped or hidden. The shape names summarize the proportions; how you use that information for hair and frames is up to you.',
  },
};
