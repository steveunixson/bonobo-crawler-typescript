/* eslint-disable react/prop-types */
import Accordion from 'react-bootstrap/es/Accordion';
import { Button, Card } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory from 'react-bootstrap-table2-filter';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React from 'react';

const BaseCard = (props) => {
  const {
    data, columns, baseName, dataKey,
  } = props;
  return (
    <Card>
      <Card.Header>
        <Accordion.Toggle as={Button} variant="link" eventKey={dataKey}>
          {baseName}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={dataKey}>
        <BootstrapTable keyField="id" data={data} columns={columns} filter={filterFactory()} />
      </Accordion.Collapse>
    </Card>
  );
};

export default BaseCard;
