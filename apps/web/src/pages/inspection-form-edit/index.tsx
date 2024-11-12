import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@libs/ui/form';
import { Input } from '@libs/ui/input';
import { Checkbox } from '@libs/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@libs/ui/select';
import { Card } from '@libs/ui/card';
import { Button } from '@libs/ui/button';
import { Calendar } from '@libs/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@libs/ui/popover';
import z from 'zod';
import { cn } from '@libs/ui/utils';
import { CalendarIcon } from 'lucide-react';
import ContentPadding from '../../components/content-padding';
import { CheckedState } from '@radix-ui/react-checkbox';
import HistoryApi from '../../api/history.api';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Props = {};

const formSchema = z.object({
  note: z.string().optional(),
  price: z.number().optional(),
  samplingPoint: z.array(z.string()),
  samplingDate: z.date().optional(),
  inspectionID: z.string(),
});

const samplingPoints = [
  {
    id: 'frontend',
    label: 'Front End',
  },
  {
    id: 'backend',
    label: 'Back End',
  },
  {
    id: 'other',
    label: 'Other',
  },
] as const;

const InspectionFormEditPage = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      samplingPoint: [],
      inspectionID: id,
    },
  });

  useEffect(() => {}, []);

  const selectedItems = form.watch('samplingPoint') || [];

  async function fetchRequiredData() {
    const data = await HistoryApi.getHistory(id!);
    console.log(data);

    form.setValue('note', data.note);
    form.setValue('price', data.price);
    if (data.samplingDate) {
      form.setValue('samplingDate', new Date(data.samplingDate));
    }
    form.setValue('samplingPoint', data.samplingPoint);
  }

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    fetchRequiredData();
  }, []);

  async function onSubmit({
    samplingDate,
    ...values
  }: z.infer<typeof formSchema>) {
    await HistoryApi.updateHistory({
      ...values,

      samplingDate: samplingDate?.toISOString(),
    });
  }

  const handleCheckboxChange = (checked: CheckedState, item: string) => {
    form.setValue(
      'samplingPoint',
      checked
        ? [...selectedItems, item]
        : selectedItems.filter((value) => value !== item),
      { shouldValidate: true } // This triggers validation on change
    );
  };

  return (
    <ContentPadding header={`Edit Inspection ID: ${id}`}>
      <Card className="p-6 md:mx-32 xl:mx-72">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input placeholder="Placeholder" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormLabel>Sampling Point</FormLabel>
              <div className="flex justify-between">
                {samplingPoints.map((item, index) => (
                  <FormItem
                    key={item.id}
                    className="space-y-0 gap-2 flex-row flex items-center"
                  >
                    <FormControl>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked: CheckedState) =>
                          handleCheckboxChange(checked, item.id)
                        }
                      />
                    </FormControl>
                    <FormLabel className="mt-0">{item.label}</FormLabel>
                    <FormMessage />
                  </FormItem>
                ))}
              </div>
              <FormField
                control={form.control}
                name="samplingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-start">
                    <FormLabel>Date/Time of Sampling</FormLabel>
                    <Popover>
                      <PopoverTrigger className="" asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Please select from date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button onClick={() => navigate(-1)} variant="outline">
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </Card>
    </ContentPadding>
  );
};

export default InspectionFormEditPage;
