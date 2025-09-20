'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footprints } from 'lucide-react';

type Co2CardProps = {
    totalCO2e: number;
};

export default function Co2Card({ totalCO2e }: Co2CardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Monthly CO2e Impact
                </CardTitle>
                <Footprints className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCO2e.toFixed(2)} kg</div>
                <p className="text-xs text-muted-foreground">
                    Your estimated carbon footprint this month
                </p>
            </CardContent>
        </Card>
    );
}
