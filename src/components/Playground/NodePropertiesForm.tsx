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
  shape?: string;
  handles?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

interface NodePropertiesFormProps {
  initialData: NodeFormValues;
  onSubmit: (data: NodeFormValues) => void;
  nodeType: string;
  nodeLabel: string;
  developerMode?: boolean;
}

const NodePropertiesForm = ({ 
  initialData, 
  onSubmit, 
  nodeType, 
  nodeLabel,
  developerMode = false
}: NodePropertiesFormProps) => {
  const form = useForm<NodeFormValues>({
    defaultValues: initialData
  });

  const shapes = [
    { value: 'rounded-lg', label: 'Rounded Rectangle' },
    { value: 'rounded-xl', label: 'Rounded' },
    { value: 'rounded-full', label: 'Circle' },
    { value: 'rounded-none', label: 'Rectangle' },
    { value: 'rounded-t-lg', label: 'Rounded Top' },
    { value: 'rounded-b-lg', label: 'Rounded Bottom' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'hexagon', label: 'Hexagon' },
  ];

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

        {developerMode && (
          <>
            <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Node Shape</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border border-gray-300 rounded-md p-2"
                      {...field}
                      defaultValue={field.value || 'rounded-lg'}
                    >
                      {shapes.map((shape) => (
                        <option key={shape.value} value={shape.value}>
                          {shape.label}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="border rounded-md p-3 space-y-3">
              <h3 className="font-medium text-sm">Connection Points</h3>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="handles.top"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top Handles</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="5" 
                          {...field} 
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="handles.right"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Right Handles</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="5" 
                          {...field} 
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="handles.bottom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bottom Handles</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="5" 
                          {...field} 
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="handles.left"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Left Handles</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="5" 
                          {...field} 
                          value={field.value || 0}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
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
