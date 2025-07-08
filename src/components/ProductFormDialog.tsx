
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { uploadImageToGithub } from '@/utils/imageUpload';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useAdminProducts';
import {ProductImage} from '@/components/ProductImage'

const ProductFormDialog = ({ open, onOpenChange, product, onAdd, onSave }: {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   product: Product | null;
   onSave: (params: { originalId: string; changes: Partial<Product> }) => Promise<boolean>;
   onAdd: (product: Partial<Product>) => Promise<void>;
 }) => {
   const [formData, setFormData] = useState<Partial<Product>>({
     id: '',
     Name: '',
     Salt: '',
     Company: '',
     Packing: '',
     MRP: 0,
     Category: '',
     visibility: true
   });
   const [isUpdating, setIsUpdating] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [image, setImage] = useState<File | null>(null);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [isManualId, setIsManualId] = useState(false); // Track if user manually edited ID
   const { toast } = useToast();

   useEffect(() => {
     if (product) {
       setFormData(product);
       setIsManualId(true); // Assume existing IDs were manually set
     } else {
       setFormData({
         id: generateId(),
         Name: '',
         Salt: '',
         Company: '',
         Packing: '',
         MRP: 0,
         Category: '',
         visibility: true
       });
       setIsManualId(false);
     }
     setImage(null);
     setImagePreview(null);
     setErrors({});
   }, [product, open]);

   const generateId = () => {
     return Math.random().toString(36).substring(2, 10);
   };

   const cleanFileName = (fileName: string) => {
     return fileName
       .replace(/\.[^/.]+$/, "") // Remove extension
       .toLowerCase()
       .replace(/[^a-z0-9-]/g, "-") // Replace special chars with hyphens
       .replace(/-+/g, "-") // Collapse multiple hyphens
       .replace(/^-+|-+$/g, "") // Trim hyphens from ends
       .substring(0, 50); // Limit length
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       setImage(file);
       setImagePreview(URL.createObjectURL(file));
       const cleanId = cleanFileName(file.name);
       setFormData(prev => ({
                  ...prev,
                  id: cleanId || generateId() // Fallback to random ID if needed
                }));

       // Auto-generate ID from filename unless user manually edited it
       if (!isManualId) {
         setFormData(prev => ({
           ...prev,
           id: cleanId || generateId() // Fallback to random ID if needed
         }));
       }
     }
   };

   const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { value } = e.target;
     setFormData(prev => ({ ...prev, id: value }));
     setIsManualId(true); // User is manually editing the ID

     if (errors.id) {
       setErrors(prev => ({ ...prev, id: '' }));
     }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value, type } = e.target;
     setFormData(prev => ({
       ...prev,
       [name]: type === 'number' ? parseFloat(value) : value
     }));

     if (errors[name]) {
       setErrors(prev => ({ ...prev, [name]: '' }));
     }
   };

   const validateForm = () => {
     const newErrors: Record<string, string> = {};

     if (!formData.Name?.trim()) {
       newErrors.Name = 'Product name is required';
     }

     if (!formData.id?.trim()) {
       newErrors.id = 'Product ID is required';
     } else {
       if (formData.id.length > 50) {
         newErrors.id = 'ID must be 50 characters or less';
       }
       if (!/^[a-z0-9-]+$/.test(formData.id)) {
         newErrors.id = 'ID can only contain lowercase letters, numbers, and hyphens';
       }
     }

     setErrors(newErrors);
     return Object.keys(newErrors).filter(k => newErrors[k]).length === 0;
   };

   const handleSave = async () => {
     if (!validateForm()) {
       toast({
         title: "Validation Error",
         description: "Please fix the errors in the form",
         variant: "destructive"
       });
       return;
     }

     setIsUpdating(true);
     try {
       // First save product data
       if (product) {
         await onSave({
           originalId: product.id,
           changes: formData
         });
       } else {
         await onAdd(formData);
       }

       // Then upload image if exists
       if (image) {
         try {
           await uploadImageToGithub({
             image,
             imageName: formData.id!,
             repo: import.meta.env.VITE_GITHUB_REPO,
             owner: import.meta.env.VITE_GITHUB_OWNER,
             branch: 'main'
           });
           toast({
             title: "Success",
             description: "Product and image saved successfully",
           });
         } catch (uploadError) {
           console.error("Image upload failed:", uploadError);
           toast({
             title: "Product saved but image upload failed",
             description: uploadError instanceof Error
               ? uploadError.message
               : "Failed to upload image",
             variant: "destructive"
           });
         }
       }

       onOpenChange(false);
     } catch (error) {
       toast({
         title: "Error",
         description: error instanceof Error
           ? error.message
           : "Failed to save product",
         variant: "destructive"
       });
     } finally {
       setIsUpdating(false);
     }
   };

   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="w-full max-w-5xl">
         <DialogHeader>
           <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
         </DialogHeader>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
           {/* Left Column - Image Upload */}
           <div className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="product-image">Product Image</Label>
               <div className="flex items-center gap-4">
                 <Input
                   id="product-image"
                   type="file"
                   accept="image/*"
                   onChange={handleImageChange}
                   className="w-full"
                 />
               </div>
               <p className="text-sm text-muted-foreground">
                Upload a high-quality product image (WEBP recommended)
               </p>
             </div>

             <div className="border rounded-lg aspect-square flex items-center justify-center bg-muted/50">
               {imagePreview ? (
                 <img
                   src={imagePreview}
                   alt="Preview"
                   className="object-contain h-full w-full p-4"
                 />
               ) : formData.id ? (
                 <ProductImage
                   productId={formData.id}
                   altText={formData.Name}
                   className="object-contain h-full w-full p-4"
                  />
               ) : (
                 <div className="text-muted-foreground text-center p-4">
                   No image uploaded
                 </div>
               )}
             </div>
           </div>

           {/* Right Column - Product Details */}
           <div className="space-y-4">
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="id" className="text-right">ID</Label>
               <div className="col-span-3">
                 <Input
                   id="id"
                   name="id"
                   value={formData.id}
                   onChange={handleIdChange}
                   className={errors.id ? 'border-destructive' : ''}
                 />
                 {errors.id && <p className="text-sm text-destructive mt-1">{errors.id}</p>}
               </div>
             </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Name" className="text-right">Name*</Label>
              <div className="col-span-3">
                <Input
                  id="Name"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className={errors.Name ? 'border-destructive' : ''}
                />
                {errors.Name && <p className="text-sm text-destructive mt-1">{errors.Name}</p>}
              </div>
            </div>
             <div className="grid grid-cols-4 items-start gap-4">
               <Label htmlFor="Salt" className="text-right mt-2">Salt</Label>
               <div className="col-span-3">
                 <textarea
                   id="Salt"
                   name="Salt"
                   value={formData.Salt}
                   onChange={(e) => setFormData(prev => ({ ...prev, Salt: e.target.value }))}
                   className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                   rows={4}
                 />
               </div>
             </div>

             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="Company" className="text-right">Company</Label>
               <Input
                 id="Company"
                 name="Company"
                 value={formData.Company}
                 onChange={handleChange}
                 className="col-span-3"
               />
             </div>

             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="Packing" className="text-right">Packing</Label>
               <Input
                 id="Packing"
                 name="Packing"
                 value={formData.Packing}
                 onChange={handleChange}
                 className="col-span-3"
               />
             </div>

             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="MRP" className="text-right">MRP</Label>
               <Input
                 id="MRP"
                 name="MRP"
                 type="number"
                 value={formData.MRP}
                 onChange={handleChange}
                 className="col-span-3 no-spinner"
               />
             </div>

             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="Category" className="text-right">Category</Label>
               <Input
                 id="Category"
                 name="Category"
                 value={formData.Category}
                 onChange={handleChange}
                 className="col-span-3"
               />
             </div>
           </div>
         </div>
             <DialogFooter>
                       <Button variant="outline" onClick={() => onOpenChange(false)}>
                         Cancel
                       </Button>
                       <Button onClick={handleSave} disabled={isUpdating}>
                         {isUpdating ? "Saving..." : (product ? 'Save' : 'Add Product')}
                       </Button>
                     </DialogFooter>
                   </DialogContent>
                 </Dialog>
               );
};

export default ProductFormDialog;
