import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Search, Menu, User, Package, Truck, Shield } from 'lucide-react';
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
      rating: 4.8,
      reviews: 256,
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Bestseller'
    },
    {
      id: 2,
      name: 'Smart Watch Series 7',
      price: 349.99,
      rating: 4.9,
      reviews: 512,
      image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      price: 89.99,
      rating: 4.6,
      reviews: 189,
      image: 'https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Sale'
    },
    {
      id: 4,
      name: '4K Action Camera',
      price: 299.99,
      rating: 4.7,
      reviews: 342,
      image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=400',
      badge: 'Hot'
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-white">
      {showEmbedInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4">Load Chat Widget</h3>
            <p className="text-gray-600 mb-4">
              Paste your widget embed code below to test it on this e-commerce demo site
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
              className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm h-48 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <header className="bg-white border-b sticky top-0 z-40">
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
            <span>Free shipping on orders over $50</span>
            <div className="flex items-center gap-4">
              <span>Track Order</span>
              <span>Support</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">TechStore</span>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Heart className="w-6 h-6 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

        <nav className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-8 py-3 text-sm">
              <button className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600">
                <Menu className="w-4 h-4" />
                Categories
              </button>
              <a href="#" className="text-gray-700 hover:text-blue-600">Electronics</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Audio</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Wearables</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Cameras</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Accessories</a>
              <a href="#" className="text-red-600 font-medium">Deals</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 mb-12 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Holiday Sale</h1>
            <p className="text-xl mb-6 text-blue-100">Up to 50% off on selected items</p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg">
              Shop Now
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <Truck className="w-12 h-12 text-blue-600" />
            <div>
              <h3 className="font-semibold mb-1">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <Package className="w-12 h-12 text-blue-600" />
            <div>
              <h3 className="font-semibold mb-1">Easy Returns</h3>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <Shield className="w-12 h-12 text-blue-600" />
            <div>
              <h3 className="font-semibold mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">100% secure transactions</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.badge}
                  </span>
                  <button className="absolute top-3 left-3 p-2 bg-white rounded-full hover:bg-gray-100">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-gray-900">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
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
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Our customer support team is here to assist you. Click the chat widget in the corner to start a conversation!
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="border-blue-600 text-blue-600">
                Email Us
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Call Support
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About TechStore</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for quality electronics and tech accessories.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Audio</a></li>
                <li><a href="#">Wearables</a></li>
                <li><a href="#">Cameras</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Track Order</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">FAQ</a></li>
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
                  placeholder="Email"
                  className="px-4 py-2 rounded bg-gray-800 text-white text-sm flex-1"
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
