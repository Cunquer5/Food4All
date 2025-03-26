
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createDonation } from '@/services/donationService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  food_type: z.string().min(1, 'Please select a food type'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  quantity_unit: z.string().min(1, 'Please select a unit'),
  expiry_date: z.date({
    required_error: 'Expiry date is required',
  }).min(new Date(), 'Expiry date must be in the future'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  latitude: z.coerce.number().default(0),
  longitude: z.coerce.number().default(0),
});

type FormValues = z.infer<typeof formSchema>;

const DonationForm = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      food_type: '',
      quantity: 1,
      quantity_unit: 'kg',
      location: user?.address || '',
      latitude: 0,
      longitude: 0,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a donation');
      return;
    }

    setIsSubmitting(true);
    try {
      // Set approximate coordinates if not provided
      if (values.latitude === 0 && values.longitude === 0) {
        values.latitude = 40.7128; // Example: New York City
        values.longitude = -74.0060;
      }

      // Add donor_id to the donation data and ensure all required fields are present
      // Convert the Date object to ISO string for expiry_date
      const donationData = {
        donor_id: user.id,
        title: values.title,
        description: values.description,
        food_type: values.food_type,
        quantity: values.quantity,
        quantity_unit: values.quantity_unit,
        expiry_date: values.expiry_date.toISOString(), // Convert Date to string
        location: values.location,
        latitude: values.latitude,
        longitude: values.longitude
      };

      await createDonation(donationData, imageFile || undefined);
      toast.success('Donation created successfully!');
      onClose();
      // Refresh the page to show the new donation
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating donation:', error);
      toast.error('Failed to create donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Fresh Vegetables from Local Market" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the food items, condition, and any other relevant details" 
                  {...field}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="food_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Food Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="produce">Fresh Produce</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="canned">Canned Goods</SelectItem>
                    <SelectItem value="meat">Meat/Protein</SelectItem>
                    <SelectItem value="prepared">Prepared Meals</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0.1" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                      <SelectItem value="items">Items</SelectItem>
                      <SelectItem value="servings">Servings</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="expiry_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, City, Country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel htmlFor="image">Food Image (Optional)</FormLabel>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-foodall-teal hover:bg-foodall-teal/90 text-white">
            {isSubmitting ? 'Creating...' : 'Create Donation'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DonationForm;
