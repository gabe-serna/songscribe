import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  id?: string;
  classname?: string;
}

export default function BenefitCard({
  title,
  subtitle,
  children,
  id = "",
  classname = "",
}: Props) {
  return (
    <Card
      id={id !== "" ? id : undefined}
      className={`mt-16 h-[35vh] max-w-[650px] border-0 bg-transparent lg:h-[80vh] ${classname}`}
    >
      <CardHeader className="flex flex-col-reverse">
        <CardTitle className="font-heading mt-2 text-2xl font-semibold leading-tight text-foreground sm:text-3xl xl:text-4xl">
          {title}
        </CardTitle>
        <CardDescription className="font-heading text-base font-bold leading-normal text-yellow-600 dark:text-yellow-500 sm:text-lg xl:text-xl">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-base sm:text-lg xl:text-xl">
        {children}
      </CardContent>
    </Card>
  );
}
