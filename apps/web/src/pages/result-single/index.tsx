import { CardContent, CardHeader, Card } from '@/ui/card';
import { Link, useParams } from 'react-router-dom';
import ContentPadding from '../../components/content-padding';
import InspectionResultItem from './inspection-result-item';
import {
  FullHistoryDto,
  HistorySubStandardData,
  HistorySubStandardSchemaDto,
} from '@libs/dto/history';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { InspectionSamplingPointConditions } from '@libs/models';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import HistoryApi from '../../api/history.api';
import { SubStandardData } from '@libs/dto/standard';
import { Button } from '@/ui/button';

export type ResultSingleProps = {};

const exampleData: FullHistoryDto = {
  imageLink:
    'https://easyrice-es-trade-data.s3.ap-southeast-1.amazonaws.com/example-rice.webp',
  inspectionID: '1232456',
  riceTypePercentage: [
    {
      name: 'a',
      value: 1.4,
    },
  ],
  createDate: new Date().toISOString(),
  standardID: '1232456',
  standardName: 'Rice',
  note: 'This is a note',
  name: 'Rice',
  price: 54321,
  samplingDate: new Date().toISOString(),
  samplingPoint: ['frontend', 'backend'],
  standardData: [
    {
      conditionMax: InspectionSamplingPointConditions.LT,
      conditionMin: InspectionSamplingPointConditions.GE,
      maxLength: 10,
      minLength: 5,
      name: 'Whole Grain',
      value: 8,
      key: 'a',
      shape: ['white', 'brown'],
    },
  ],
};

const ResultSingle = (props: ResultSingleProps) => {
  const { id } = useParams();
  const [history, setHistory] = useState<FullHistoryDto>(exampleData);

  const fetchHistory = async () => {
    const data = await HistoryApi.getHistory(id ?? '');
    setHistory(data);
  };

  function generateRanges(schema: SubStandardData[]): string[] {
    return schema.map((item) => {
      const { minLength, maxLength, conditionMin, conditionMax } = item;
      let minStr, maxStr;

      switch (conditionMin) {
        case InspectionSamplingPointConditions.GE:
          minStr = `${minLength.toFixed(2)}-`;
          break;
        case InspectionSamplingPointConditions.GT:
          minStr = `${(minLength + 0.01).toFixed(2)}-`;
          break;
        default:
          throw new Error(`Unsupported conditionMin: ${conditionMin}`);
      }

      switch (conditionMax) {
        case InspectionSamplingPointConditions.LE:
          maxStr = `${maxLength.toFixed(2)}`;
          break;
        case InspectionSamplingPointConditions.LT:
          maxStr = `${(maxLength - 0.01).toFixed(2)}`;
          break;
        default:
          throw new Error(`Unsupported conditionMax: ${conditionMax}`);
      }

      return `${minStr}${maxStr}`;
    });
  }

  useEffect(() => {
    fetchHistory();
  }, []);
  return (
    <ContentPadding header={`Inspection ${history.name}`}>
      <div className="flex space-x-8">
        <div>
          <img
            src={history?.imageLink}
            alt="Rice"
            className="w-full h-96 object-cover"
          />
          <div className="flex space-x-2 pt-2 justify-end">
            <Link to={`/history`}>
              <Button variant={'outline'}>Back</Button>
            </Link>
            <Link to={`/standard/${id}`}>
              <Button>Edit</Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 p-4 text-card-foreground space-y-4 rounded-xl bg-gray-100">
          <Card>
            <CardContent className="pt-6 grid grid-cols-2 gap-2">
              <InspectionResultItem header="Create Date - Time">
                {history?.createDate
                  ? format(history.createDate, 'dd/MM/yyyy - HH:mm:ss')
                  : 'No date'}
              </InspectionResultItem>
              <InspectionResultItem header="Inspection ID">
                {history.inspectionID}
              </InspectionResultItem>
              <InspectionResultItem header="Standard">
                {history.standardName}
              </InspectionResultItem>
              <InspectionResultItem header="Total Sample">
                {history?.samplingPoint?.length ?? 0} kernels
              </InspectionResultItem>
              <InspectionResultItem header="Update Date - Time">
                {history?.createDate
                  ? format(history.createDate, 'dd/MM/yyyy - HH:mm:ss')
                  : 'No date'}
              </InspectionResultItem>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 grid grid-cols-2 gap-2">
              <InspectionResultItem header="Note">
                {history?.note ?? 'No note'}
              </InspectionResultItem>
              <InspectionResultItem header="Price">
                {history?.price ? history.price.toLocaleString() : 'Not set'}
              </InspectionResultItem>
              <InspectionResultItem header="Date/Time of Sampling">
                {history?.samplingDate
                  ? format(history.samplingDate, 'd MMM yyyy HH:mm:ss', {
                      locale: th,
                    })
                  : 'No date'}
              </InspectionResultItem>
              <InspectionResultItem header="Sampling Point">
                {history.samplingPoint.join(', ')}
              </InspectionResultItem>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-0 pb-2 pt-6 px-6 text-xl">
              Composition
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px]">Length</TableHead>
                    <TableHead className="w-[100px]">Actual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.standardData.map((riceType) => (
                    <TableRow key={riceType.key}>
                      <TableCell className="font-medium">
                        {riceType.name}
                      </TableCell>
                      <TableCell>{generateRanges([riceType])}</TableCell>
                      <TableCell className="text-primary">
                        {riceType.value.toFixed(2)} %
                      </TableCell>
                      {/* <TableCell className="font-medium">
                        {invoice.invoice}
                      </TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="p-0 pb-2 pt-6 px-6 text-xl">
              Defect Rice
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Name</TableHead>
                    <TableHead className="w-[100px]">Actual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {[].map((invoice: any) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">
                        {invoice.invoice}
                      </TableCell>
                      <TableCell className="text-right">
                        {invoice.totalAmount}
                      </TableCell>
                    </TableRow>
                  ))} */}
                  {history.riceTypePercentage
                    .filter((a) => a.name !== 'white')
                    .map((riceType) => (
                      <TableRow key={riceType.name}>
                        <TableCell className="font-medium">
                          {riceType.name}
                        </TableCell>
                        <TableCell className="text-primary">
                          {riceType.value.toFixed(2)} %
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="text-primary">
                      {history.riceTypePercentage
                        .filter((a) => a.name !== 'white')
                        .map((a) => a.value)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2)}{' '}
                      %
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentPadding>
  );
};

export default ResultSingle;
