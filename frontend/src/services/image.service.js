class ImageService {
  // Generate product-specific image URLs based on category and product name
  static generateProductImageUrl(productId, category, productName) {
    // Normalize inputs
    const normalizedCategory = (category || '').toLowerCase();
    const normalizedName = (productName || '').toLowerCase();
    
    // Product-specific image selection
    if (normalizedName.includes('iphone') || normalizedName.includes('samsung galaxy') || normalizedName.includes('phone')) {
      return `https://picsum.photos/300/300?random=${productId}&category=electronics&product=phone`;
    } else if (normalizedName.includes('macbook') || normalizedName.includes('dell') || normalizedName.includes('laptop')) {
      return `https://picsum.photos/300/300?random=${productId}&category=electronics&product=laptop`;
    } else if (normalizedName.includes('ipad') || normalizedName.includes('tablet')) {
      return `https://picsum.photos/300/300?random=${productId}&category=electronics&product=tablet`;
    } else if (normalizedName.includes('watch')) {
      return `https://picsum.photos/300/300?random=${productId}&category=electronics&product=watch`;
    } else if (normalizedName.includes('headphones') || normalizedName.includes('earbuds')) {
      return `https://picsum.photos/300/300?random=${productId}&category=electronics&product=headphones`;
    } else if (normalizedName.includes('switch') || normalizedName.includes('gaming')) {
      return `https://picsum.photos/300/300?random=${productId}&category=electronics&product=gaming`;
    } else if (normalizedName.includes('mixer') || normalizedName.includes('kitchenaid')) {
      return `https://picsum.photos/300/300?random=${productId}&category=home&product=mixer`;
    } else if (normalizedName.includes('shoes') || normalizedName.includes('sneakers')) {
      return `https://picsum.photos/300/300?random=${productId}&category=fashion&product=shoes`;
    } else if (normalizedName.includes('jeans') || normalizedName.includes('pants')) {
      return `https://picsum.photos/300/300?random=${productId}&category=fashion&product=pants`;
    } else if (normalizedName.includes('jacket') || normalizedName.includes('coat')) {
      return `https://picsum.photos/300/300?random=${productId}&category=fashion&product=jacket`;
    } else if (normalizedName.includes('dumbbell') || normalizedName.includes('fitness')) {
      return `https://picsum.photos/300/300?random=${productId}&category=sports&product=fitness`;
    } else if (normalizedName.includes('book')) {
      return `https://picsum.photos/300/300?random=${productId}&category=books&product=book`;
    } else if (normalizedName.includes('cream') || normalizedName.includes('skincare')) {
      return `https://picsum.photos/300/300?random=${productId}&category=beauty&product=skincare`;
    } else if (normalizedName.includes('game') || normalizedName.includes('board')) {
      return `https://picsum.photos/300/300?random=${productId}&category=toys&product=game`;
    } else if (normalizedName.includes('battery')) {
      return `https://picsum.photos/300/300?random=${productId}&category=automotive&product=battery`;
    }
    
    // Category-based fallback
    switch(normalizedCategory) {
      case 'electronics':
        return `https://picsum.photos/300/300?random=${productId}&category=electronics`;
      case 'home & kitchen':
        return `https://picsum.photos/300/300?random=${productId}&category=home`;
      case 'sports':
        return `https://picsum.photos/300/300?random=${productId}&category=sports`;
      case 'books':
        return `https://picsum.photos/300/300?random=${productId}&category=books`;
      case 'fashion':
        return `https://picsum.photos/300/300?random=${productId}&category=fashion`;
      case 'beauty':
        return `https://picsum.photos/300/300?random=${productId}&category=beauty`;
      case 'toys':
        return `https://picsum.photos/300/300?random=${productId}&category=toys`;
      case 'automotive':
        return `https://picsum.photos/300/300?random=${productId}&category=automotive`;
      default:
        return `https://picsum.photos/300/300?random=${productId}`;
    }
  }
  
  // Generate gallery images for product details page
  static generateGalleryImages(productId, category, productName) {
    const baseUrl = this.generateProductImageUrl(productId, category, productName);
    
    // Add additional gallery images with different random seeds
    return [
      baseUrl,
      `https://picsum.photos/500/500?random=${productId + 100}&category=${encodeURIComponent(category || 'product')}`,
      `https://picsum.photos/500/500?random=${productId + 200}&category=${encodeURIComponent(category || 'product')}`,
      `https://picsum.photos/500/500?random=${productId + 300}&category=${encodeURIComponent(category || 'product')}`
    ];
  }
  
  // Generate fallback image when product image is not available
  static generateFallbackImageUrl(productId, category = 'product') {
    return `https://picsum.photos/300/300?random=${productId}&category=${encodeURIComponent(category)}`;
  }
  
  /* Add to ImageService.js */
  static optimizeImage(url, width) {
    return `${url}?w=${width}&q=75&format=webp`;
  }
}

export default ImageService;