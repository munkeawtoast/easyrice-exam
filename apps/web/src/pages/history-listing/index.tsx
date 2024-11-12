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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@libs/ui/table';
import { Card } from '@libs/ui/card';
import { Button } from '@libs/ui/button';
import { Calendar } from '@libs/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@libs/ui/popover';
import z from 'zod';
import { cn } from '@libs/ui/utils';
import { CalendarIcon, Search, TrashIcon } from 'lucide-react';
import ContentPadding from '../../components/content-padding';
import HistoryApi from '../../api/history.api';
import { useEffect, useState } from 'react';
import { HistoryDto } from '@libs/dto/history';
import { Checkbox } from '@libs/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { Link } from 'react-router-dom';
type Props = {};

const formSchema = z.object({
  id: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

const HistoryListingPage = (props: Props) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const [history, setHistory] = useState<HistoryDto[]>([]);

  async function fetchHistory(
    fromDate?: string,
    toDate?: string,
    inspectionID?: string
  ) {
    const fetchHistory = await HistoryApi.listHistory(
      fromDate,
      toDate,
      inspectionID
    );
    setHistory(fetchHistory.data);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    fetchHistory(
      values.fromDate?.toISOString(),
      values.toDate?.toISOString(),
      values.id
    );
  }

  const handleCheckboxChange = (checked: CheckedState, item: string) => {
    setSelectedRows((prev) =>
      checked
        ? [...prev, item]
        : prev.filter((selectedItem) => selectedItem !== item)
    );
  };

  const handleDeleteButton = async () => {
    await HistoryApi.deleteHistory(selectedRows);
    await fetchHistory();
  };

  function resetForm() {
    form.reset();
  }
  useEffect(() => {
    fetchHistory();
  }, []);
  return (
    <ContentPadding>
      <Form {...form}>
        <Card className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between gap-4 xl:gap-12">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-start">
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Search with ID"
                        className="lg:w-[280px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-start">
                    <FormLabel>From date</FormLabel>
                    <Popover>
                      <PopoverTrigger className="" asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full md:w-[240px] lg:w-[280px] pl-3 text-left font-normal',
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
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
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
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-start">
                    <FormLabel>To date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full md:w-[240px] lg:w-[280px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Please select to date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
            <div className="flex justify-between  gap-4">
              <Button
                onClick={resetForm}
                type="reset"
                variant="link"
                className="text-red-600"
              >
                Clear filter
              </Button>
              <Button type="submit">
                <Search /> Submit
              </Button>
            </div>
          </form>
        </Card>
      </Form>

      <div className="my-6">
        <Button
          variant="outline"
          className="border-primary text-primary hover:text-destructive-foreground hover:bg-destructive hover:border-destructive"
          onClick={handleDeleteButton}
        >
          <TrashIcon className="ml-auto h-4 w-4" /> Delete
        </Button>
      </div>
      <div className="mt-6 rounded-md border">
        <Table>
          <TableHeader className="bg-primary ">
            <TableHead className="text-primary-foreground"></TableHead>
            <TableHead className="text-primary-foreground">
              Create Date - Time
            </TableHead>
            <TableHead className="text-primary-foreground">
              Inspection ID
            </TableHead>
            <TableHead className="text-primary-foreground">Name</TableHead>
            <TableHead className="text-primary-foreground">Standard</TableHead>
            <TableHead className="text-primary-foreground">Note</TableHead>
          </TableHeader>
          <TableBody>
            {history.map((his) => (
              <TableRow key={his.inspectionID}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(his.inspectionID)}
                    onCheckedChange={(checked: CheckedState) =>
                      handleCheckboxChange(checked, his.inspectionID)
                    }
                  />
                </TableCell>
                <Link to={`/history/${his.inspectionID}`} className="contents">
                  <TableCell>
                    {his.createDate
                      ? format(his.createDate, 'dd/MM/yyyy - HH:mm:ss')
                      : 'No date'}
                  </TableCell>
                  <TableCell>{his.inspectionID}</TableCell>
                  <TableCell>{his.name}</TableCell>
                  <TableCell>{his.standardName}</TableCell>
                  <TableCell>{his.note}</TableCell>
                </Link>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentPadding>
  );
};

export default HistoryListingPage;
