import React from 'react';
import { Table } from 'react-bootstrap';
import TableBody from './TableBody';

export default () => (
  <Table striped bordered hover variant="dark">
    <thead>
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Username</th>
      </tr>
    </thead>
    <TableBody />
  </Table>
);
