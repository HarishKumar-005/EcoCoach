'use client';

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { logEcoAction } from '@/app/actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Bird, Bike, Bus, Car, Leaf, Thermometer, UtensilsCrossed, Wind } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';

const dietSchema = z.object({
  category: z.literal('diet'),
  dietMealType: z.string({ required_error: 'Please select a meal type.' }),
  dietServings: z.coerce.number().min(1, 'Servings must be at least 1.'),
});

const travelSchema = z.object({
  category: z.literal('travel'),
  travelMode: z.string({ required_error: 'Please select a mode of transport.' }),
  travelDistance: z.coerce.number().min(0.1, 'Distance must be at least 0.1 km.'),
});

const energySchema = z.object({
  category: z.literal('energy'),
  energyAction: z.string({ required_error: 'Please select an energy action.' }),
});

const formSchema = z.discriminatedUnion('category', [dietSchema, travelSchema, energySchema]);

type FormData = z.infer<typeof formSchema>;

export default function LogActionForm({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<'diet' | 'travel' | 'energy'>('diet');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'diet',
      dietMealType: undefined,
      dietServings: undefined,
    },
  });

  const handleTabChange = (value: string) => {
    const newCategory = value as 'diet' | 'travel' | 'energy';
    setActiveTab(newCategory);
    form.reset(); // Reset form state on tab change
    form.setValue('category', newCategory);
  };
  
  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      let details;
      
      switch (values.category) {
        case 'diet':
          details = { mealType: values.dietMealType, servings: values.dietServings };
          break;
        case 'travel':
          details = { mode: values.travelMode, distance: values.travelDistance };
          break;
        case 'energy':
          details = { action: values.energyAction };
          break;
      }

      const result = await logEcoAction(userId, values.category, details);
      if (result.success) {
        toast({ title: 'Success!', description: 'Your action has been logged.' });
        form.reset();
        form.setValue('category', activeTab);

      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.error || 'Could not log your action.' });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log a New Action</CardTitle>
        <CardDescription>Record your sustainable actions to track your impact.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <Tabs
              value={activeTab}
              className="w-full"
              onValueChange={handleTabChange}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="diet">Diet</TabsTrigger>
                <TabsTrigger value="travel">Travel</TabsTrigger>
                <TabsTrigger value="energy">Energy</TabsTrigger>
              </TabsList>
              <TabsContent value="diet" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="dietMealType"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Meal Type</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Beef"><div className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4"/> Beef</div></SelectItem>
                          <SelectItem value="Chicken"><div className="flex items-center gap-2"><Bird className="h-4 w-4"/> Chicken</div></SelectItem>
                          <SelectItem value="Vegetarian"><div className="flex items-center gap-2"><Leaf className="h-4 w-4"/> Vegetarian</div></SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dietServings"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Servings</Label>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 1" {...field} onChange={event => field.onChange(+event.target.value)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="travel" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="travelMode"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Mode of Transport</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a mode of transport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Car"><div className="flex items-center gap-2"><Car className="h-4 w-4"/> Car</div></SelectItem>
                          <SelectItem value="Bus"><div className="flex items-center gap-2"><Bus className="h-4 w-4"/> Bus</div></SelectItem>
                          <SelectItem value="Bike"><div className="flex items-center gap-2"><Bike className="h-4 w-4"/> Bike</div></SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="travelDistance"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Distance (km)</Label>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} onChange={event => field.onChange(+event.target.value)}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="energy" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="energyAction"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Action</Label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a home energy action" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           <SelectItem value="Lowered Thermostat"><div className="flex items-center gap-2"><Thermometer className="h-4 w-4"/> Lowered Thermostat</div></SelectItem>
                           <SelectItem value="Air-dried laundry"><div className="flex items-center gap-2"><Wind className="h-4 w-4"/> Air-dried laundry</div></SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Logging...' : 'Log Action'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
