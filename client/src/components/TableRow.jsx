/* eslint-disable react/prop-types */
import React from 'react';
import {
  InputGroup,
  FormControl,
  Button,
  Dropdown,
} from 'react-bootstrap';

export default (props) => {
  const { id } = props;
  return (
    <tr>
      <td>{id}</td>
      <td>
        <FormControl
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon2"
        />
      </td>
      <td>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Фильтры
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Без фильтра</Dropdown.Item>
            <Dropdown.Item href="#/action-2">На карте</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Другой фильтр</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
      <td>
        <FormControl
          placeholder="Url"
          aria-label="Url"
          aria-describedby="basic-addon2"
        />
      </td>
      <td>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Recipient's email"
            aria-label="Recipient's email"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Append>
            <Button variant="danger"> Добавить </Button>
          </InputGroup.Append>
        </InputGroup>
      </td>
    </tr>
  );
};
