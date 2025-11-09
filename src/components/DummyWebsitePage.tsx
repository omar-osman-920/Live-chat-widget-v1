import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Search, User, Package, Truck, Shield, Check } from 'lucide-react';
import { Button } from './ui/button';

export function DummyWebsitePage() {
  const [embedCode, setEmbedCode] = useState('');
  const [showEmbedInput, setShowEmbedInput] = useState(true);

  const loadWidget = () => {
    if (!embedCode.trim()) return;

    const existingWidgets = document.querySelectorAll('[id^="live-chat-widget-"]');
    existingWidgets.forEach(widget => widget.remove());

    const existingScripts = document.querySelectorAll('script[data-widget-id]');
    existingScripts.forEach(script => script.remove());

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = embedCode.trim();
      const scriptTag = tempDiv.querySelector('script');

      if (scriptTag) {
        const newScript = document.createElement('script');

        if (scriptTag.src) {
          newScript.src = scriptTag.src;
        }

        Array.from(scriptTag.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        if (scriptTag.textContent) {
          newScript.textContent = scriptTag.textContent;
        }

        document.body.appendChild(newScript);
        setShowEmbedInput(false);

        setTimeout(() => {
          const widgets = document.querySelectorAll('[id^="live-chat-widget-"]');
          if (widgets.length > 0) {
            console.log('Widget loaded successfully');
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error loading widget:', error);
      alert('Failed to load widget. Please check the console for details.');
    }
  };

  useEffect(() => {
    return () => {
      const existingWidgets = document.querySelectorAll('[id^="live-chat-widget-"]');
      existingWidgets.forEach(widget => widget.remove());

      const existingScripts = document.querySelectorAll('script[data-widget-id]');
      existingScripts.forEach(script => script.remove());
    };
  }, []);

  const products = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 199.99,
      oldPrice: 249.99,
      rating: 4.8,
      reviews: 256,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      name: 'Smart Watch Series 7',
      price: 349.99,
      oldPrice: 399.99,
      rating: 4.9,
      reviews: 512,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      price: 89.99,
      oldPrice: 129.99,
      rating: 4.6,
      reviews: 189,
      image: 'https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 4,
      name: '4K Action Camera',
      price: 299.99,
      oldPrice: 349.99,
      rating: 4.7,
      reviews: 342,
      image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 5,
      name: 'Wireless Gaming Mouse',
      price: 79.99,
      oldPrice: 99.99,
      rating: 4.7,
      reviews: 423,
      image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 6,
      name: 'Mechanical Keyboard RGB',
      price: 129.99,
      oldPrice: 159.99,
      rating: 4.8,
      reviews: 634,
      image: 'https://images.pexels.com/photos/1194713/pexels-photo-1194713.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-white">
      {showEmbedInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Load Chat Widget</h3>
            <p className="text-gray-600 mb-6">
              Paste your widget embed code to test it on this demo site
            </p>
            <textarea
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder="<!-- Chat Widget Code -->
<script
  src=&quot;http://localhost:5173/widget-loader.js&quot;
  data-widget-id=&quot;your-widget-id&quot;
  data-language=&quot;english&quot;>
</script>"
              className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm h-40 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowEmbedInput(false)}
              >
                Skip for Now
              </Button>
              <Button
                onClick={loadWidget}
                disabled={!embedCode.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Load Widget
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="bg-gray-900 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-sm">
              <p>Free shipping on orders over $50</p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray-300">Track Order</a>
                <a href="#" className="hover:text-gray-300">Support</a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TechStore</span>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Premium Tech at Your Fingertips
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover the latest gadgets with exclusive discounts. Free shipping, easy returns, and 2-year warranty on all products.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Shop Now
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                  View Deals
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Premium Headphones"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Easy Returns</p>
                <p className="text-sm text-gray-600">30-day guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <div className="bg-orange-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Secure Payment</p>
                <p className="text-sm text-gray-600">SSL encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <div className="bg-purple-100 p-3 rounded-full">
                <Check className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">2-Year Warranty</p>
                <p className="text-sm text-gray-600">On all products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Handpicked tech essentials at unbeatable prices</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative group overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-red-50 transition-colors shadow-lg">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviews})</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.oldPrice}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-semibold">
                      Save ${(product.oldPrice - product.price).toFixed(2)}
                    </p>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Need Help Choosing?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Our customer support team is ready to assist you. Click the chat widget to start a conversation!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
              Email Us
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Call Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TechStore</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for quality electronics and tech accessories.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Electronics</a></li>
                <li><a href="#" className="hover:text-white">Audio</a></li>
                <li><a href="#" className="hover:text-white">Wearables</a></li>
                <li><a href="#" className="hover:text-white">Cameras</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Track Order</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">
                Subscribe for exclusive deals
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded bg-gray-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2024 TechStore. All rights reserved.
          </div>
        </div>
      </footer>

      {!showEmbedInput && (
        <button
          onClick={() => setShowEmbedInput(true)}
          className="fixed bottom-24 left-4 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 text-sm z-30"
        >
          Change Widget
        </button>
      )}
    </div>
  );
}
