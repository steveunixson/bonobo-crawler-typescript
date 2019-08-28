import React from 'react';
import {
  Tab, Table, Tabs, Accordion,
} from 'react-bootstrap';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { textFilter, Comparator } from 'react-bootstrap-table2-filter';
import TableBody from './TableBody';
import BaseCard from './BaseCard';

const products = [
  {
    id: 1,
    name: 'Test1',
    price: '100',
  },
  {
    id: 2,
    name: 'Test2',
    price: '1000',
  },
  {
    id: 3,
    name: 'Test2',
    price: '100000',
  },
];
const columns = [{
  dataField: 'id',
  text: 'Product ID',
}, {
  dataField: 'name',
  text: 'Product Name',
  filter: textFilter({
    comparator: Comparator.EQ,
  }),
}, {
  dataField: 'price',
  text: 'Product Price',
  filter: textFilter(),
}];

export default () => (
  <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
    <Tab eventKey="home" title="Задачи">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Поисковый запрос</th>
            <th>Фильтр</th>
            <th>Url</th>
            <th>Email</th>
          </tr>
        </thead>
        <TableBody />
      </Table>
    </Tab>
    <Tab eventKey="profile" title="Базы">
      <Accordion>
        <BaseCard data={products} columns={columns} baseName="БАЗА 1" dataKey="0" />
        <BaseCard data={products} columns={columns} baseName="БАЗА 2" dataKey="1" />
        <BaseCard data={products} columns={columns} baseName="БАЗА 3" dataKey="2" />
        <BaseCard data={products} columns={columns} baseName="БАЗА 4" dataKey="3" />
        <BaseCard data={products} columns={columns} baseName="БАЗА 5" dataKey="4" />
      </Accordion>
    </Tab>
  </Tabs>
);
