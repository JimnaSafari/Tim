
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2, X, Printer } from 'lucide-react';
import { useBatches } from '@/hooks/useBatches';
import { toast } from 'sonner';

interface BatchAgreementProps {
  batchId: string;
  batchName: string;
  onClose: () => void;
}

const BatchAgreement = ({ batchId, batchName, onClose }: BatchAgreementProps) => {
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { generateAgreement } = useBatches();

  const handleGenerateAgreement = async () => {
    setLoading(true);
    try {
      const result = await generateAgreement(batchId);
      setAgreement(result.agreement);
      toast.success('Agreement generated successfully!');
    } catch (error) {
      console.error('Error generating agreement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download PDF');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TiM Chama Agreement - ${batchName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3 { color: #2c3e50; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .signature-section { 
              margin-top: 40px; 
              border-top: 2px solid #eee; 
              padding-top: 20px; 
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${contentRef.current.innerHTML}
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShareAgreement = async () => {
    if (!agreement) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `TiM Chama Agreement - ${batchName}`,
          text: 'TiM Chama Agreement for review and signing',
          url: window.location.href
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(agreement.agreement_content);
        toast.success('Agreement copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing agreement:', error);
      toast.error('Failed to share agreement');
    }
  };

  const formatAgreementContent = (content: string) => {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold text-center mb-6 text-blue-600">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-gray-800">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-gray-700">{line.substring(4)}</h3>;
        } else if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mb-2">{line.substring(2, line.length - 2)}</p>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
        } else if (line === '---') {
          return <hr key={index} className="my-6 border-gray-300" />;
        } else {
          return <p key={index} className="mb-2">{line}</p>;
        }
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="glassmorphism p-6 border-0 w-full max-w-6xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-900/95 p-4 -m-4 mb-6 border-b border-gray-600">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            TiM Chama Agreement - {batchName}
          </h3>
          <div className="flex gap-2">
            {agreement && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="border-gray-600 text-gray-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareAgreement}
                  className="border-gray-600 text-gray-300"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {!agreement ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">Generate TiM Chama Agreement</h4>
            <p className="text-gray-400 mb-6">
              Create a legally sound agreement template for your merry-go-round batch.
              This will include all member details, contribution structure, and terms.
            </p>
            <Button
              onClick={handleGenerateAgreement}
              disabled={loading}
              className="gradient-primary text-white"
            >
              {loading ? 'Generating...' : 'Generate Agreement'}
            </Button>
          </div>
        ) : (
          <div ref={contentRef} className="agreement-content bg-white p-8 rounded-lg text-black">
            {formatAgreementContent(agreement.agreement_content)}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BatchAgreement;
