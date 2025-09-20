'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
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

const formSchema = z.object({
  dietMealType: z.string().optional(),
  dietServings: z.coerce.number().positive().optional(),
  travelMode: z.string().optional(),
  travelDistance: z.coerce.number().positive().optional(),
  energyAction: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function LogActionForm({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<'diet' | 'travel' | 'energy'>('diet');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = () => {
    startTransition(async () => {
      let details;
      const values = watch();
      
      switch (activeTab) {
        case 'diet':
          if (!values.dietMealType || !values.dietServings) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields for diet.' });
            return;
          }
          details = { mealType: values.dietMealType, servings: values.dietServings };
          break;
        case 'travel':
          if (!values.travelMode || !values.travelDistance) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill all fields for travel.' });
            return;
          }
          details = { mode: values.travelMode, distance: values.travelDistance };
          break;
        case 'energy':
           if (!values.energyAction) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select an energy action.' });
            return;
          }
          details = { action: values.energyAction };
          break;
        default:
          return;
      }

      const result = await logEcoAction(userId, activeTab, details);
      if (result.success) {
        toast({ title: 'Success!', description: 'Your action has been logged.' });
        reset();
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
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="diet" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diet">Diet</TabsTrigger>
              <TabsTrigger value="travel">Travel</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
            </TabsList>
            <TabsContent value="diet" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="diet-meal-type">Meal Type</Label>
                 <Select onValueChange={(v) => setValue('dietMealType', v)} value={watch('dietMealType')}>
                  <SelectTrigger id="diet-meal-type">
                    <SelectValue placeholder="Select a meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beef"><div className="flex items-center gap-2"><UtensilsCrossed className="h-4 w-4"/> Beef</div></SelectItem>
                    <SelectItem value="Chicken"><div className="flex items-center gap-2"><Bird className="h-4 w-4"/> Chicken</div></SelectItem>
                    <SelectItem value="Vegetarian"><div className="flex items-center gap-2"><Leaf className="h-4 w-4"/> Vegetarian</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="diet-servings">Servings</Label>
                <Input id="diet-servings" type="number" placeholder="e.g., 1" {...register('dietServings')} />
              </div>
            </TabsContent>
            <TabsContent value="travel" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="travel-mode">Mode of Transport</Label>
                <Select onValueChange={(v) => setValue('travelMode', v)} value={watch('travelMode')}>
                  <SelectTrigger id="travel-mode">
                    <SelectValue placeholder="Select a mode of transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Car"><div className="flex items-center gap-2"><Car className="h-4 w-4"/> Car</div></SelectItem>
                    <SelectItem value="Bus"><div className="flex items-center gap-2"><Bus className="h-4 w-4"/> Bus</div></SelectItem>
                    <SelectItem value="Bike"><div className="flex items-center gap-2"><Bike className="h-4 w-4"/> Bike</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="travel-distance">Distance (km)</Label>
                <Input id="travel-distance" type="number" placeholder="e.g., 10" {...register('travelDistance')} />
              </div>
            </TabsContent>
            <TabsContent value="energy" className="space-y-4 pt-4">
               <div className="space-y-2">
                <Label htmlFor="energy-action">Action</Label>
                <Select onValueChange={(v) => setValue('energyAction', v)} value={watch('energyAction')}>
                  <SelectTrigger id="energy-action">
                    <SelectValue placeholder="Select a home energy action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lowered Thermostat"><div className="flex items-center gap-2"><Thermometer className="h-4 w-4"/> Lowered Thermostat</div></SelectItem>
                    <SelectItem value="Air-dried laundry"><div className="flex items-center gap-2"><Wind className="h-4 w-4"/> Air-dried laundry</div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSubmit} disabled={isPending}>
          {isPending ? 'Logging...' : 'Log Action'}
        </Button>
      </CardFooter>
    </Card>
  );
}
