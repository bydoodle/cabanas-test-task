# 1. Two extra assets

I didn't change anything regarding the water texture — it is still ignored, while the parchment texture is used as the background.

# 2. One-side chalet

I added a system that calculates only one path for objects, or two paths if the object is accessible from both the left and right sides.

The changes are in map.ts, lines 166–233.

# 3. Responsive design

I didn't add a mobile-responsive layout because it isn't necessary for this project.

For desktop, I fixed the view by making a few changes to the body styles in index.css.

# 4. Cabana restriction and case-insensitive name check

I added a restriction that prevents a user from booking more than one cabana.

I also added a case-insensitive and order-insensitive check for the user's first and last name. This means that both John Smith and smith john will be accepted, regardless of letter case.

The changes are in booking.ts.

# 5. Empty frame

I added a function that checks whether there are neighboring elements around a cell.

The map parser can now accept map.ascii files without requiring an empty frame around the map.

The changes are in map.ts.
