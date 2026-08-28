require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Account = require("./models/Account");
const CustomerProof = require("./models/CustomerProof");
const FAQ = require("./models/FAQ");
const Order = require("./models/Order");
const Setting = require("./models/Setting");
const User = require("./models/User");

const adminEmail = "admin@gamingmarket.test";
const adminPassword = "Admin@12345";

const accounts = [
  {
    game: "BGMI",
    title: "Conqueror Ready BGMI Account",
    description:
      "A clean high-rank BGMI account with premium outfits, weapon skins, and rare inventory highlights.",
    price: 1799,
    level: "75",
    specifications: {
      rank: "Conqueror",
      outfits: "50+",
      weaponSkins: "25+",
      mythics: "3"
    },
    images: ["/placeholders/account-bgmi-1.svg"],
    status: "AVAILABLE",
    featured: true
  },
  {
    game: "BGMI",
    title: "Ace Master BGMI Inventory",
    description:
      "Balanced BGMI account for players who want a strong rank and practical inventory without overpaying.",
    price: 1299,
    level: "68",
    specifications: {
      rank: "Ace Master",
      outfits: "35+",
      weaponSkins: "18+",
      vehicles: "2"
    },
    images: ["/placeholders/account-bgmi-2.svg"],
    status: "AVAILABLE",
    featured: true
  },
  {
    game: "BGMI",
    title: "Classic BGMI Starter Plus",
    description:
      "Affordable BGMI account with useful skins and a clean profile for everyday ranked play.",
    price: 799,
    level: "52",
    specifications: {
      rank: "Crown",
      outfits: "20+",
      weaponSkins: "12+",
      emotes: "6"
    },
    images: ["/placeholders/account-bgmi-3.svg"],
    status: "AVAILABLE",
    featured: false
  },
  {
    game: "FREE_FIRE",
    title: "Heroic Free Fire Account",
    description:
      "Free Fire account with a Heroic profile, several character unlocks, and strong cosmetic inventory.",
    price: 1499,
    level: "70",
    specifications: {
      rank: "Heroic",
      characters: "18+",
      bundles: "30+",
      gunSkins: "20+"
    },
    images: ["/placeholders/account-free-fire-1.svg"],
    status: "AVAILABLE",
    featured: true
  },
  {
    game: "FREE_FIRE",
    title: "Elite Pass Free Fire Collection",
    description:
      "A polished Free Fire account with multiple Elite Pass items and a clean purchase-ready profile.",
    price: 1199,
    level: "64",
    specifications: {
      rank: "Diamond",
      elitePassItems: "25+",
      bundles: "22+",
      pets: "5"
    },
    images: ["/placeholders/account-free-fire-2.svg"],
    status: "AVAILABLE",
    featured: false
  },
  {
    game: "FREE_FIRE",
    title: "Free Fire Budget Bundle Account",
    description:
      "Simple Free Fire account for quick play, with enough bundles and gun skins for a strong start.",
    price: 699,
    level: "48",
    specifications: {
      rank: "Platinum",
      bundles: "14+",
      gunSkins: "10+",
      characters: "9+"
    },
    images: ["/placeholders/account-free-fire-3.svg"],
    status: "AVAILABLE",
    featured: false
  }
];

const faqs = [
  {
    question: "How do I receive the gaming account after payment?",
    answer:
      "After your payment is verified, the admin contacts you manually on WhatsApp and shares the account details.",
    order: 1,
    active: true
  },
  {
    question: "Is payment verified automatically?",
    answer:
      "No. You pay manually through UPI, submit the UTR and screenshot, and the admin checks the payment manually.",
    order: 2,
    active: true
  },
  {
    question: "Can customers sell accounts here?",
    answer:
      "No. This marketplace is admin-controlled, so only the admin can add gaming accounts.",
    order: 3,
    active: true
  }
];

const proofs = [
  {
    title: "Payment proof placeholder",
    imageUrl: "/placeholders/proof-1.svg",
    order: 1,
    active: true
  },
  {
    title: "Customer proof placeholder",
    imageUrl: "/placeholders/proof-2.svg",
    order: 2,
    active: true
  },
  {
    title: "Delivery proof placeholder",
    imageUrl: "/placeholders/proof-3.svg",
    order: 3,
    active: true
  }
];

const seed = async () => {
  await connectDB();

  await Promise.all([
    Account.deleteMany({}),
    Order.deleteMany({}),
    FAQ.deleteMany({}),
    CustomerProof.deleteMany({}),
    Setting.deleteMany({})
  ]);

  let admin = await User.findOne({ email: adminEmail }).select("+password");

  if (!admin) {
    admin = new User({
      name: "Marketplace Admin",
      email: adminEmail,
      phone: "9999999999",
      role: "ADMIN"
    });
  }

  admin.name = "Marketplace Admin";
  admin.phone = "9999999999";
  admin.password = adminPassword;
  admin.role = "ADMIN";
  await admin.save();

  await Account.insertMany(accounts);
  await FAQ.insertMany(faqs);
  await CustomerProof.insertMany(proofs);
  await Setting.create({
    key: "payment",
    upiId: "example@upi",
    qrCodeUrl: "/placeholders/qr-placeholder.svg"
  });

  console.log("Seed data created");
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);
  console.log("Change the admin password immediately after first login.");

  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
