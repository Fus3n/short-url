import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

const Payments = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState('Free');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSubscription('Free');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const plans = [
    { name: 'Free', monthlyPrice: 0, yearlyPrice: 0, features: ['20 short links', 'Basic analytics'] },
    { name: 'Basic', monthlyPrice: 9.99, yearlyPrice: 99.99, features: ['100 short links', 'Basic analytics', 'Email support'] },
    { name: 'Pro', monthlyPrice: 19.99, yearlyPrice: 199.99, features: ['Unlimited short links', 'Advanced analytics', 'Priority support'] },
    { name: 'Enterprise', monthlyPrice: 49.99, yearlyPrice: 499.99, features: ['Custom domain', 'API access', 'Dedicated account manager'] },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Subscription Plans</h1>
      <Alert className="mb-8">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Current Subscription</AlertTitle>
        <AlertDescription>You are currently on the <strong>{currentSubscription}</strong> plan.</AlertDescription>
      </Alert>
      <div className="flex items-center justify-center mb-8">
        <span className="mr-2">Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className="ml-2">Yearly (Save 20%)</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name} className={`flex flex-col ${plan.name === currentSubscription ? 'border-primary' : ''}`}>
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="text-lg font-semibold">
                {plan.monthlyPrice === 0 ? 'Free' : 
                  `$${isYearly ? plan.yearlyPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}`
                }
                <span className="text-sm font-normal">
                  {plan.monthlyPrice !== 0 && ` / ${isYearly ? 'year' : 'month'}`}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="list-disc list-inside space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="text-sm">{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={plan.name === currentSubscription}>
                {plan.name === currentSubscription ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Payments;