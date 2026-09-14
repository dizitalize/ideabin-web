import os
from PIL import Image

src_path = r"C:\Users\hypom\.gemini\antigravity-ide\brain\5c487d85-84db-4824-af4b-a4fbc262345b\.user_uploaded\media_1789385912857.png"
img = Image.open(src_path).convert("RGBA")

width, height = img.size
pixels = img.load()

# Prepare dark mode (white idea + orange bin) and light mode (dark idea + orange bin)
img_white = Image.new("RGBA", (width, height), (0, 0, 0, 0))
pix_white = img_white.load()

img_dark = Image.new("RGBA", (width, height), (0, 0, 0, 0))
pix_dark = img_dark.load()

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        brightness = max(r, g, b)
        
        # Black background threshold
        if brightness < 18:
            continue
            
        # Calculate smooth alpha for anti-aliased edge blending
        if brightness < 60:
            alpha = int((brightness - 18) / (60 - 18) * 255)
        else:
            alpha = 255
            
        # Check if it's the white "idea" part (r, g, b are almost identical and x is on the left side)
        # In the image, 'idea' is roughly the left 58% of the image
        diff = max(abs(r - g), abs(g - b), abs(r - b))
        is_idea_white = (diff < 25) and (x < width * 0.59)
        
        if is_idea_white:
            # Dark mode: crisp white
            pix_white[x, y] = (255, 255, 255, alpha)
            # Light mode: dark graphite #111111
            pix_dark[x, y] = (17, 17, 17, alpha)
        else:
            # "bin" part: keep the exact authentic orange-gold gradient
            pix_white[x, y] = (r, g, b, alpha)
            pix_dark[x, y] = (r, g, b, alpha)

# Crop to tight bounding box
bbox_w = img_white.getbbox()
if bbox_w:
    img_white = img_white.crop(bbox_w)
    img_dark = img_dark.crop(bbox_w)

out_dir = r"c:\Workspace\public\public"
img_white.save(os.path.join(out_dir, "ideabin_wordmark_white.png"), "PNG")
img_dark.save(os.path.join(out_dir, "ideabin_wordmark_dark.png"), "PNG")

print("Generated pixel-perfect wordmarks:")
print("- public/ideabin_wordmark_white.png")
print("- public/ideabin_wordmark_dark.png")
