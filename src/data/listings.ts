import type {Category, Listing, ListingCondition} from '../types';

const items: Array<{
  title: string;
  price: number;
  category: Category;
  condition: ListingCondition;
  description: string;
}> = [
  {title: 'Nike Air Max Sneakers', price: 6800, category: 'Fashion', condition: 'Good', description: 'Classic black and white Air Max sneakers with light heel wear and clean soles.'},
  {title: 'iPhone 13 Silicone Case', price: 1200, category: 'Electronics', condition: 'Like New', description: 'Soft-touch navy case with MagSafe support. Used for one week.'},
  {title: 'Vintage Denim Jacket', price: 5400, category: 'Fashion', condition: 'Good', description: 'Relaxed fit denim jacket with a faded wash and sturdy buttons.'},
  {title: 'Ceramic Coffee Dripper Set', price: 2200, category: 'Home', condition: 'Like New', description: 'White ceramic V60-style dripper with matching server for slow mornings.'},
  {title: 'Adidas Running Shorts', price: 1800, category: 'Sports', condition: 'Good', description: 'Lightweight black running shorts with zip pocket and drawstring waist.'},
  {title: 'Kindle Paperwhite Cover', price: 1500, category: 'Electronics', condition: 'Good', description: 'Charcoal folding cover that wakes and sleeps compatible Kindle Paperwhite models.'},
  {title: 'Wooden Building Blocks', price: 2600, category: 'Toys', condition: 'Fair', description: 'Colorful wooden block set with storage bag. A few small marks from play.'},
  {title: 'Haruki Murakami Novel Set', price: 3200, category: 'Books', condition: 'Good', description: 'Three paperback novels with clean pages and minor shelf wear.'},
  {title: 'Laneige Lip Sleeping Mask', price: 900, category: 'Beauty', condition: 'New', description: 'Unopened berry lip mask purchased as a duplicate.'},
  {title: 'Minimal Desk Lamp', price: 3400, category: 'Home', condition: 'Like New', description: 'Adjustable LED desk lamp with warm and cool light modes.'},
  {title: 'Nintendo Switch Carrying Case', price: 2100, category: 'Electronics', condition: 'Good', description: 'Hard-shell Switch case with cartridge slots and mesh accessory pocket.'},
  {title: 'Uniqlo Cashmere Sweater', price: 4200, category: 'Fashion', condition: 'Like New', description: 'Soft gray crewneck sweater stored folded and worn twice.'},
  {title: 'Yoga Mat with Strap', price: 1900, category: 'Sports', condition: 'Good', description: 'Non-slip 6mm yoga mat in sage green with carrying strap.'},
  {title: 'Japanese Cookbook', price: 1700, category: 'Books', condition: 'Good', description: 'Home cooking cookbook with practical weeknight recipes and clean pages.'},
  {title: 'Robot Vacuum Spare Filters', price: 1100, category: 'Home', condition: 'New', description: 'Sealed pack of replacement filters for popular compact robot vacuums.'},
  {title: 'Sony Wireless Earbuds Case', price: 1300, category: 'Electronics', condition: 'Good', description: 'Protective silicone case with clip for Sony wireless earbuds charging case.'},
  {title: 'Leather Crossbody Bag', price: 7600, category: 'Fashion', condition: 'Like New', description: 'Compact tan leather crossbody bag with adjustable strap and clean lining.'},
  {title: 'Kids Puzzle Bundle', price: 2400, category: 'Toys', condition: 'Good', description: 'Four educational puzzles for preschool age children. All pieces included.'},
  {title: 'Dumbbell Pair 5kg', price: 3600, category: 'Sports', condition: 'Fair', description: 'Pair of 5kg rubber-coated dumbbells with cosmetic scuffs.'},
  {title: 'Glass Food Storage Set', price: 2800, category: 'Home', condition: 'Good', description: 'Five glass containers with snap lids for meal prep and leftovers.'},
  {title: 'Fujifilm Camera Strap', price: 2500, category: 'Electronics', condition: 'Like New', description: 'Woven camera strap compatible with mirrorless cameras. Comfortable and clean.'},
  {title: 'Zara Floral Midi Dress', price: 3900, category: 'Fashion', condition: 'Good', description: 'Flowy floral dress with side zipper. Perfect for spring outings.'},
  {title: 'Catan Board Game', price: 3300, category: 'Toys', condition: 'Good', description: 'Japanese edition board game with all cards, tiles, and pieces checked.'},
  {title: 'The Design of Everyday Things', price: 1400, category: 'Books', condition: 'Good', description: 'Paperback design classic with no highlighting and slight cover wear.'},
  {title: 'Portable Facial Steamer', price: 3100, category: 'Beauty', condition: 'Like New', description: 'Compact facial steamer used twice and cleaned thoroughly.'},
  {title: 'Casio Digital Watch', price: 2300, category: 'Fashion', condition: 'Good', description: 'Retro black digital watch with working battery and adjustable strap.'},
  {title: 'Anker USB-C Charger 65W', price: 3700, category: 'Electronics', condition: 'Good', description: 'Compact fast charger with folding plug. Cable not included.'},
  {title: 'Indoor Plant Pot Trio', price: 2000, category: 'Home', condition: 'Like New', description: 'Three matte ceramic pots for herbs or small houseplants.'},
  {title: 'Tennis Racket Wilson', price: 5800, category: 'Sports', condition: 'Fair', description: 'Wilson racket with fresh overgrip and frame scratches from normal use.'},
  {title: 'Studio Ghibli Art Book', price: 4500, category: 'Books', condition: 'Like New', description: 'Large-format art book with vivid prints and pristine pages.'},
  {title: 'Bluetooth Mechanical Keyboard', price: 6200, category: 'Electronics', condition: 'Good', description: 'Compact keyboard with tactile switches, Bluetooth pairing, and USB-C charging.'},
  {title: 'Patagonia Fleece Vest', price: 6900, category: 'Fashion', condition: 'Good', description: 'Warm navy fleece vest with zip pockets and no major pilling.'},
  {title: 'Lego City Fire Truck', price: 4100, category: 'Toys', condition: 'Good', description: 'Assembled once, disassembled into bags, instruction booklet included.'},
  {title: 'Resistance Band Set', price: 1600, category: 'Sports', condition: 'New', description: 'Five resistance bands with pouch for travel workouts.'},
  {title: 'Skincare Sample Bundle', price: 1000, category: 'Beauty', condition: 'New', description: 'Assorted unopened serum, cleanser, and moisturizer samples.'},
  {title: 'Muji Acrylic Organizer', price: 2100, category: 'Home', condition: 'Good', description: 'Clear acrylic drawer organizer for cosmetics, stationery, or desk accessories.'},
  {title: 'Ray-Ban Sunglasses Case', price: 900, category: 'Fashion', condition: 'Fair', description: 'Original hard case with cleaning cloth. Case has small exterior marks.'},
  {title: 'MacBook USB-C Hub', price: 2900, category: 'Electronics', condition: 'Good', description: 'Aluminum USB-C hub with HDMI, USB-A, SD card, and passthrough charging.'},
  {title: 'Pokemon Plush Pikachu', price: 1900, category: 'Toys', condition: 'Like New', description: 'Soft Pikachu plush displayed on a shelf and kept clean.'},
  {title: 'Modern Mystery Paperback Bundle', price: 2600, category: 'Books', condition: 'Good', description: 'Five mystery novels with crisp pages for a weekend reading stack.'},
  {title: 'Compact Hair Dryer', price: 2700, category: 'Beauty', condition: 'Good', description: 'Foldable travel hair dryer with two speed settings.'},
  {title: 'North Face Daypack', price: 7400, category: 'Fashion', condition: 'Good', description: 'Durable 20L daypack with laptop sleeve and clean zippers.'},
  {title: 'Garmin Bike Mount', price: 1500, category: 'Sports', condition: 'Like New', description: 'Handlebar mount for Garmin cycling computers. Includes rubber inserts.'},
  {title: 'Bamboo Cutting Board', price: 1800, category: 'Home', condition: 'Good', description: 'Medium bamboo board treated with food-safe oil.'},
  {title: 'Wireless Mouse Logitech', price: 2400, category: 'Electronics', condition: 'Good', description: 'Quiet-click wireless mouse with USB receiver stored in battery slot.'},
  {title: 'Silk Hair Scrunchies Set', price: 1300, category: 'Beauty', condition: 'New', description: 'Set of three silk scrunchies in neutral colors, unopened.'},
  {title: 'Baby Board Book Collection', price: 2200, category: 'Books', condition: 'Fair', description: 'Six sturdy board books with rounded corners and normal toddler wear.'},
  {title: 'Reusable Shopping Tote', price: 800, category: 'Other', condition: 'Like New', description: 'Foldable black tote bag with reinforced handles for grocery runs.'},
  {title: 'Travel Neck Pillow', price: 1400, category: 'Other', condition: 'Good', description: 'Memory foam neck pillow with washable cover and carry pouch.'},
  {title: 'Stationery Washi Tape Lot', price: 1600, category: 'Other', condition: 'Good', description: 'Ten decorative washi tape rolls with plenty remaining on each roll.'},
];

const soldIds = new Set(['3', '8', '14', '19', '25', '31', '42', '47']);

export const listings: Listing[] = items.map((item, index) => {
  const id = String(index + 1);

  return {
    id,
    ...item,
    images: [`https://picsum.photos/300/300?random=${id}`],
    sellerId: `user${Math.floor(index / 5) + 1}`,
    isSold: soldIds.has(id),
  };
});
