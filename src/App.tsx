import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

async function rewriteEmail(email: string, style: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/rewrite-email/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, style }),
    });

    const data = await response.json();
    if (response.ok) {
      return data.rewritten_email;
    } else {
      throw new Error(data.error || "Unknown error");
    }
  } catch (error: any) {
    console.error('⚠️ Error rewriting email:', error);
    throw error;
  }
}

function App() {
  const [email, setEmail] = useState('');
  const [style, setStyle] = useState('professional');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutput('');
    try {
      const result = await rewriteEmail(email, style);
      setOutput(result);
    } catch (err) {
      setError('Failed to rewrite email. Please check backend/server/API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Email Rewriter</h1>
          <p className="text-gray-600">Transform your emails with AI-powered tone adjustment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Original Email</h2>
            <textarea
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type or paste your email here..."
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="mt-4 flex gap-4">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="persuasive">Persuasive</option>
                <option value="apologetic">Apologetic</option>
                <option value="short">Short & Direct</option>
              </select>

              <button
                onClick={handleRewrite}
                disabled={isLoading || !email.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Rewrite
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Rewritten Email</h2>
            <div className="w-full h-48 p-4 bg-gray-50 rounded-lg overflow-auto whitespace-pre-wrap">
              {output || (
                <span className="text-gray-400">
                  Your rewritten email will appear here...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
