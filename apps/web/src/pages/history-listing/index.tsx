import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
} from '@libs/ui/table';
import { Card } from '@libs/ui/card';
import { Button } from '@libs/ui/button';
import { Calendar } from '@libs/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@libs/ui/popover';
import z from 'zod';
import { cn } from '@libs/ui/utils';
import { CalendarIcon, Search } from 'lucide-react';
type Props = {};

const formSchema = z.object({
  id: z.string(),
  fromDate: z.date(),
  toDate: z.date(),
});

const HistoryListingPage = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  function resetForm() {
    form.reset();
  }
  return (
    <>
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
      {/* <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div> */}
    </>
  );
};

export default HistoryListingPage;
