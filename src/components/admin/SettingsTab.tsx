// components/admin/SettingsTab.tsx
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bulkUploadImagesToGithub } from '@/utils/imageUpload';
import { downloadCSV } from '@/utils/csvUtils';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const SettingsTab: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILES = 50;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

  const cleanFileName = (fileName: string) => {
    return fileName
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50);
  };

  const handleBulkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Validate files
        const validFiles = Array.from(files).filter(file =>
          file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE
        );

        if (validFiles.length === 0) {
          toast({
            title: "No Valid Files",
            description: "No valid image files found for upload",
            variant: "destructive"
          });
          return;
        }

        const uploadToast = toast({
          title: "Starting Bulk Upload",
          description: `Preparing to upload ${validFiles.length} images`,
          duration: Infinity // Keep toast open during upload
        });

        try {
          const imagesToUpload = validFiles.map(file => ({
            file,
            name: cleanFileName(file.name)
          }));

          const { success, failures } = await bulkUploadImagesToGithub({
            images: imagesToUpload,
            repo: import.meta.env.VITE_GITHUB_REPO,
            owner: import.meta.env.VITE_GITHUB_OWNER,
            branch: 'main'
          });

          uploadToast.update({
            id: uploadToast.id,
            title: "Bulk Upload Complete",
            description: `Successfully uploaded ${success.length}/${validFiles.length} images`,
            variant: failures.length > 0 ? "destructive" : "default",
            duration: 5000
          });

          if (failures.length > 0) {
            console.error("Failed uploads:", failures);
            toast({
              title: "Some Uploads Failed",
              description: `${failures.length} images failed to upload. Please check the console for details.`,
              variant: "destructive"
            });
          }
        } catch (error) {
          uploadToast.update({
            id: uploadToast.id,
            title: "Bulk Upload Failed",
            description: error instanceof Error ? error.message : "Unknown error occurred",
            variant: "destructive",
            duration: 5000
          });
        } finally {
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };


  const handleDownloadTemplate = () => {
    const headers = ['id', 'Name', 'Salt', 'Company', 'Packing', 'MRP', 'Category'];
    const data = [{
      id: 'optional',
      Name: 'required',
      Salt: 'optional',
      Company: 'optional',
      Packing: 'optional',
      MRP: '0.00',
      Category: 'optional'
    }];
    downloadCSV(data, headers, 'product_template.csv');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import/Export Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                      <Label>CSV Template</Label>
                      <div className="text-sm text-muted-foreground">
                        Download template for bulk imports
                      </div>
                      <Button variant="outline" onClick={handleDownloadTemplate} className="gap-1">
                        <Download className="w-4 h-4" /> Download Template
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <Label>Bulk Image Upload</Label>
                                <div className="text-sm text-muted-foreground">
                                  Upload multiple product images (max {MAX_FILES}, 5MB each)
                                </div>
                                <div className="flex gap-1">
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleBulkImageUpload}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    id="bulk-image-upload"
                                  />
                                  <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="gap-1"
                                  >
                                    <Upload className="w-4 h-4" /> Upload Images
                                  </Button>
                                </div>
                              </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <Label>Default Items Per Page</Label>
                    <Select defaultValue="25">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 items</SelectItem>
                        <SelectItem value="50">50 items</SelectItem>
                        <SelectItem value="100">100 items</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm">Save</Button>
                  </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;