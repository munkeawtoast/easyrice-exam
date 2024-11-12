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
import {
  ListStandardResponseDto,
  SubStandardSchemaDto,
} from '@libs/dto/standard';
import { useEffect, useState } from 'react';
import StandardApi from '../../api/standard.api';
import { RiceRawAnalysis, RiceRawAnalysisSchema } from '@libs/models';
type Props =
  | {
      isEditing: true;
      referenceId: string;
    }
  | {
      isEditing: false;
    };

const formSchema = z.object({
  name: z.string(),
  standardID: z.string(),
  standardName: z.string(),
  standardData: SubStandardSchemaDto.array(),
  file: z.any(),
  note: z.string().optional(),
  price: z.coerce.number().optional(),
  samplingDate: z.date().optional(),
  samplingPoint: z.array(z.string()),
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

const InspectionFormPage = (props: Props) => {
  const [standardSet, setStandardSet] = useState<ListStandardResponseDto>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      samplingPoint: [],
    },
  });

  useEffect(() => {
    (async function () {
      const standards = await StandardApi.listStandard();
      setStandardSet(standards);
    })();
  }, []);

  const selectedItems = form.watch('samplingPoint') || [];

  async function onSubmit({
    file: files,
    samplingDate,
    ...values
  }: z.infer<typeof formSchema>) {
    const fileList = files as FileList;
    const realFile = fileList.item(0);
    let parsedAnalysis: RiceRawAnalysis | undefined = undefined;
    if (realFile) {
      try {
        if (!realFile.type.includes('json')) {
          throw new Error();
        }
        const text = await realFile.text();
        const parsed = JSON.parse(text);
        parsedAnalysis = RiceRawAnalysisSchema.parse(parsed);
      } catch (e) {
        window.alert('Invalid file.');
        return;
      }
    }
    await HistoryApi.createHistory({
      ...values,
      rawData: parsedAnalysis,
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

  const handleStandardChange = (value: string) => {
    form.setValue('standardID', value);
    const standard = standardSet.find((item) => item.id === value)!;
    form.setValue('standardName', standard.standardName);
    form.setValue('standardData', standard.standardData);
  };

  return (
    <ContentPadding header="Create Inspection">
      <Card className="p-6 md:mx-32 xl:mx-72">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Placeholder" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Standard *</FormLabel>
                <FormControl>
                  <Select onValueChange={handleStandardChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Please select standard" />
                    </SelectTrigger>
                    <SelectContent>
                      {standardSet.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.standardName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        {...form.register('file')}
                        placeholder="raw1.json"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr />

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
                          // disabled={(date) }
                          // disabled={(date) =>
                          //   date > new Date() || date < new Date('1900-01-01')
                          // }
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
              <Button type="reset" variant="outline">
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

export default InspectionFormPage;
