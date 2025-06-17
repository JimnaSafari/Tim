
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBatches } from '@/hooks/useBatches';
import { toast } from 'sonner';

interface BatchAgreementProps {
  batchId: string;
  batchName: string;
  onClose: () => void;
}

const BatchAgreement = ({ batchId, batchName, onClose }: BatchAgreementProps) => {
  const [agreement, setAgreement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { generateAgreement } = useBatches();

  useEffect(() => {
    fetchAgreement();
  }, [batchId]);

  const fetchAgreement = async () => {
    try {
      const { data, error } = await supabase
        .from('batch_agreements')
        .select('*')
        .eq('batch_id', batchId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching agreement:', error);
        return;
      }

      setAgreement(data);
    } catch (error) {
      console.error('Error fetching agreement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAgreement = async () => {
    setGenerating(true);
    try {
      const result = await generateAgreement(batchId);
      setAgreement(result.agreement);
      toast.success('Agreement generated successfully!');
    } catch (error) {
      console.error('Error generating agreement:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!agreement?.agreement_content) return;

    const blob = new Blob([agreement.agreement_content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${batchName.replace(/\s+/g, '_')}_Agreement.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="glassmorphism p-6 border-0 w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {batchName} - Legal Agreement
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!agreement ? (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">No Agreement Generated</h4>
            <p className="text-gray-400 mb-6">
              Generate a legal agreement for this TiM Chama batch to define terms and conditions.
            </p>
            <Button
              onClick={handleGenerateAgreement}
              disabled={generating}
              className="gradient-primary text-white"
            >
              {generating ? 'Generating...' : 'Generate Agreement'}
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-400">
                Created: {new Date(agreement.created_at).toLocaleDateString()}
              </div>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="border-gray-600 text-gray-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>

            <Card className="glassmorphism-dark p-4 border-0">
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">
                {agreement.agreement_content}
              </pre>
            </Card>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleGenerateAgreement}
                disabled={generating}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                {generating ? 'Regenerating...' : 'Regenerate Agreement'}
              </Button>
              <Button
                onClick={onClose}
                className="gradient-primary text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BatchAgreement;
