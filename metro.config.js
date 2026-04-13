const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Dòng này cực kỳ quan trọng: Cho phép Metro đóng gói file .db
config.resolver.assetExts.push('db');

module.exports = config;