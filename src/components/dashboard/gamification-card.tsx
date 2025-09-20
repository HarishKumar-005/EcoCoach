'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award, Medal, Star, Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type GamificationCardProps = {
    points: number;
    badges: string[];
};

const badgeIcons: { [key: string]: React.ReactNode } = {
    'Seedling Starter': <Star className="h-6 w-6 text-yellow-400" />,
    'Green Giant': <Medal className="h-6 w-6 text-slate-400" />,
    'Eco-Hero': <Trophy className="h-6 w-6 text-amber-500" />,
};

export default function GamificationCard({ points, badges }: GamificationCardProps) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span className="text-sm font-medium">Your Progress</span>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Points earned and badges collected.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <div>
                    <div className="text-2xl font-bold">{points}</div>
                    <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
                <div className="flex space-x-2">
                    <TooltipProvider>
                    {badges.map((badge, index) => (
                        <Tooltip key={index}>
                             <TooltipTrigger asChild>
                                <div className="p-2 bg-muted rounded-full">
                                    {badgeIcons[badge] || <Star className="h-6 w-6"/>}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{badge}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    </TooltipProvider>
                </div>
            </CardContent>
        </Card>
    );
}
