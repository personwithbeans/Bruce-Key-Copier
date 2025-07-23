# Key Copy Utility for Bruce JS Interpreter

This script is designed for use with the Bruce JS interpreter and a 1.9" ST7789V IPS color TFT LCD. It provides a graphical interface for visualizing and copying key profiles, specifically for pin tumbler keys. The script allows users to select key types, visualize notches, and interact with the key profile.

- **Key Type Selection:** Choose from common key types (e.g., Kwikset KW1, Schlage SC4, Arrow AR4, Master Lock M1, American AM7). -- WIP

## Usage

1. **Setup:**  
  Have Bruce Firmware installed on your device (currently only deisgned for Lillygo T-EMBED CC1101)
2. **Run the Script:**  
   Load  the script in your Bruce JS Interpreter.

3. **Controls:**  
   - **ESC Button:** Opens the main menu (change key type, save, new, exit).
   - **Select Button:** Cycles through the notches, highlighting the current one. 
   - **Display:** Shows the current key type and a graphical representation of the key profile. -- WIP/Rough Draft

4. **Key Types:**  
   The script supports the following key types by default:
   - Kwikset KW1 -- not yet supported
   - Schlage SC4
   - Arrow AR4 -- not yet supported
   - Master Lock M1 -- not yet supported
   - American AM7 -- not yet supported

## Customization

- **Add More Key Types:**   -- WIP
- **Colour Profiles:**  
  Currently just using the global colour values bruce is set to.

## Requirements

- Version of Bruce with JS interpreter (github.com/pr3y/Bruce)
- 1.9" ST7789V IPS color TFT LCD (or compatible display) -- ( Lillygo T-Embed CC1101 )

## Disclaimer

This script is for educational and lawful use only. Copying keys without permission is illegal in many jurisdictions.

---

**Author:**  
PersonWithBeans

**License:**  
AGPL-3.0 license
