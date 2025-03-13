
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

interface NodeFormValues {
  label: string;
  description?: string;
  value?: string;
  min?: string;
  max?: string;
  currency?: string;
  tokenName?: string;
  role?: string;
  type?: string;
}

interface NodePropertiesFormProps {
  initialData: NodeFormValues;
  onSubmit: (data: NodeFormValues) => void;
  nodeType: string;
  nodeLabel: string;
}

const NodePropertiesForm = ({ initialData, onSubmit, nodeType, nodeLabel }: NodePropertiesFormProps) => {
  const form = useForm<NodeFormValues>({
    defaultValues: initialData
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {(nodeType === 'contract' || nodeType === 'action') && (
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {nodeType === 'value' && (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {nodeType === 'bound' && nodeLabel === 'Between' && (
          <>
            <FormField
              control={form.control}
              name="min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {nodeType === 'bound' && nodeLabel === 'Exactly' && (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exact Value</FormLabel>
                <FormControl>
                  <Input {...field} type="number" />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {nodeType === 'token' && nodeLabel === 'Currency' && (
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {nodeType === 'token' && nodeLabel === 'Token ID' && (
          <>
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tokenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        {nodeType === 'party' && nodeLabel === 'Role' && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </Form>
  );
};

export default NodePropertiesForm;
