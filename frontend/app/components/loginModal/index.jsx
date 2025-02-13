'use client';

import React, { useEffect, useState } from 'react';
import { createBEM } from '@lacorda/bem';
import { Modal, Form, Input, Select, Button, Checkbox } from 'antd';
import { useUpdateEffect } from 'ahooks';
import fetchAPI from '@/app/utils/fetch';
import './index.scss';

const bem = createBEM('mern-login-modal');

const LoginModal = (props) => {
  const { className, visible, onClose } = props;

  const [form] = Form.useForm();

  const [show, setShow] = useState(visible);

  const [disabled, setDisabled] = useState(true);

  const formValues = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields(['phone'], { validateOnly: true })
      .then(() => { setDisabled(false) })
      .catch(() => { setDisabled(true) });
  }, [form, formValues]);

  const cls = bem([className]);

  useUpdateEffect(() => {
    setShow(visible);
  }, [visible])

  const handleCancel = () => {
    form.resetFields();
    setShow(false);
    onClose?.();
  }

  /**
   * TODO
   * 1. 调用check接口；若未注册，则调用register接口；若已注册，则调用login接口
   */
  const onSubmit = (values) => {
    console.log('🍄  onSubmit', values);
    fetchAPI.post('/api/v1/auth/checkLogin', values).then((res) => {
      console.log('🍄  res', res);
    }).catch((err) => {
      console.log('🍄  err', err);
    })
  }

  const onSubmitFailed = (errorInfo) => {
    console.log('🍄  onSubmitFailed', errorInfo);
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 100 }} options={[{ value: '86', label: '+86' }]}></Select>
    </Form.Item>
  );

  return (
    <Modal
      className={cls} open={show} footer={null}
      closable={false} width={738}
      onCancel={handleCancel}
    >
      <div className='flex min-h-[400px]'>
        <div className={bem('left', ['flex-1', 'bg-blue-400'])}></div>
        <div className={bem('right', ['flex-1', 'p-[20px]', 'flex', 'flex-col', 'items-center'])}>
          <div className='text-lg font-semibold mb-[32px]'>欢迎登录</div>
          <Form
            form={form}
            size='large'
            className='flex flex-col items-center'
            initialValues={{ prefix: '86' }}
            onFinish={onSubmit}
            onFinishFailed={onSubmitFailed}
          >
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入您的手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block disabled={disabled}>
                下一步
              </Button>
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请先阅读并同意使用协议')),
                },
              ]}
            >
              <Checkbox>
                已阅读并同意<a href="https://www.baidu.com">使用协议</a>
              </Checkbox>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;