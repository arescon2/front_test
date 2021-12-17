import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'react-grid-system';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, FormGroup, Icon, InputGroup, TextArea } from '@blueprintjs/core';

import { Form, Field } from 'react-final-form'

import { onTaskEdit, onTaskNewApi } from '../features/api';

import { setAppTitle } from '../stores/mainSlice';
import { toast } from 'react-toastify';

const TaskOneForm = ({ getTasks }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id_task } = useParams();

  const [emailError, setEmailError] = useState('');
  const [isSubmiting, setIsSubmitting] = useState(false);

  const { oneTask } = useSelector((state) => state.main);

  const isEdited = id_task ? id_task === 'new' ? false : true : false;
  
  let TITLE = id_task === 'new' ? 'Новая задача' : 'Редактирование задачи';

  const BREADCRUMBS = [
    { href: '/', icon: 'home', text: 'Главная' },
    { icon: 'form', text: TITLE },
  ];

  const onToUrl = (url) => navigate(url);

  const onSubmit = ({ id, text, status, username, email }) => {
    setIsSubmitting(true);
    if(isEdited) {
      let isStatus = status === 0 ? 1 : status;
        isStatus = status === 10 ? 11 : isStatus;

      onTaskEdit(id, text, isStatus).then( ({ status, message }) => {
        if(status === 'error') navigate('/login');
        if(status === 'ok') {
          toast.success('Изменения сохранены');
          getTasks();
          navigate('/');
        };
      })
    } else {
      onTaskNewApi(username, email, text).then( ({ status, message }) => {
        if(status === 'error') setEmailError(message.email);
        if(status === 'ok') {
          toast.success('Задача создана');
          getTasks();
          navigate('/');
        };
      });
    }
  };

  const onEmailChange = (event, input) => {
    emailError && setEmailError(false);
    input.onChange(event);
  }

  useEffect(() => {
    dispatch(setAppTitle(TITLE));
  }, []);
  
  const required = (value) => (value ? undefined : "Поле не может быть пустым");

  return <Row>
    <Col md={12}>
      <ul className="bp3-breadcrumbs app">
        {
          BREADCRUMBS.map( ({href, text, icon}, index) => {
            let isLast = BREADCRUMBS.length === index+1;
            return <li key={index + 'breadcrumb'}>
              {
                isLast ? <><Icon icon={icon} /> <span className="bp3-breadcrumb bp3-breadcrumb-current">{text}</span></>
                  : <Button icon={icon} minimal className="bp3-breadcrumb" onClick={() => onToUrl(href) } text={text} />
              }
            </li>
          })
        }
      </ul>
    </Col>
    <Col md={12}>
      <Card>
        <Form
          initialValues={oneTask}
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Field name="username" validate={required}>
                    {({ input, meta }) => {
                      let errorField = meta.error && meta.touched;
                      return <FormGroup
                        label="Имя пользователя"
                        labelFor="username-input"
                        helperText={errorField ? meta.error : ''}
                        intent={ errorField  ? 'warning' : '' }
                      >
                        <InputGroup
                          id="username-input"
                          name={input.name}
                          value={input.value}
                          disabled={isEdited}
                          onChange={input.onChange}
                          intent={ errorField ? 'warning' : '' }
                          placeholder="Имя пользователя"
                        />
                      </FormGroup>
                    }}
                  </Field>
                </Col>
                <Col md={6}>
                  <Field name="email" validate={required}>
                    {({ input, meta }) => {
                      let errorField = meta.error && meta.touched;
                      return <FormGroup
                        label="email"
                        labelFor="email-input"
                        helperText={errorField ? meta.error : emailError || ''}
                        intent={ errorField  ? 'warning' : emailError ? 'warning' : '' }
                      >
                        <InputGroup
                          id="email-input"
                          name={input.name}
                          value={input.value}
                          disabled={isEdited}
                          onChange={(event) => onEmailChange(event, input)}
                          placeholder="email"
                          intent={ errorField  ? 'warning' : emailError ? 'warning' : '' }
                        />
                      </FormGroup>
                    }}
                  </Field>
                </Col>
                <Col md={12}>
                  <Field name="text" validate={required}>
                    {({ input, meta }) => {
                      let errorField = meta.error && meta.touched;
                      return <FormGroup
                          label="Опишите задачу"
                          labelFor="text-input"
                          helperText={errorField ? meta.error : ''}
                          intent={ errorField  ? 'warning' : '' }
                        >
                          <TextArea
                            id="text-input"
                            growVertically
                            large
                            fill
                            intent={ errorField  ? 'warning' : '' }
                            placeholder='Опишите задачу'
                            name={input.name}
                            value={input.value}
                            onChange={input.onChange}
                          />
                        </FormGroup>
                    }}
                  </Field>
                </Col>
                <Col md={12}>
                  <Button disabled={isSubmiting ? true : false} intent='primary' text={ isEdited ? 'Сохранить изменение' : 'Добавить задачу' } type='submit' />
                </Col>
              </Row>
            </form>
          )}
        />
      </Card>
    </Col>
  </Row>
};

export default TaskOneForm;