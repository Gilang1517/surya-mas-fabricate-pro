
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select';
  label: string;
  required: boolean;
  options?: string[];
  validation?: string;
}

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt: string;
  category: string;
}

const FormEditor = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<FormTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: '',
    fields: [] as FormField[]
  });

  const [newField, setNewField] = useState({
    name: '',
    type: 'text' as FormField['type'],
    label: '',
    required: false,
    options: '',
    validation: ''
  });

  const addField = () => {
    if (!newField.name || !newField.label) {
      toast({
        title: "Error",
        description: "Nama field dan label harus diisi",
        variant: "destructive"
      });
      return;
    }

    const field: FormField = {
      id: Date.now().toString(),
      name: newField.name,
      type: newField.type,
      label: newField.label,
      required: newField.required,
      options: newField.type === 'select' ? newField.options.split(',').map(o => o.trim()) : undefined,
      validation: newField.validation || undefined
    };

    if (editingTemplate) {
      setEditingTemplate(prev => prev ? {
        ...prev,
        fields: [...prev.fields, field]
      } : null);
    } else {
      setNewTemplate(prev => ({
        ...prev,
        fields: [...prev.fields, field]
      }));
    }

    setNewField({
      name: '',
      type: 'text',
      label: '',
      required: false,
      options: '',
      validation: ''
    });

    toast({
      title: "Field ditambahkan",
      description: "Field berhasil ditambahkan ke form",
    });
  };

  const saveTemplate = () => {
    const templateData = editingTemplate || newTemplate;
    
    if (!templateData.name || !templateData.description || templateData.fields.length === 0) {
      toast({
        title: "Error",
        description: "Nama, deskripsi, dan minimal satu field harus diisi",
        variant: "destructive"
      });
      return;
    }

    const template: FormTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      name: templateData.name,
      description: templateData.description,
      category: templateData.category || 'General',
      fields: templateData.fields,
      createdAt: editingTemplate?.createdAt || new Date().toISOString().split('T')[0]
    };

    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
      setEditingTemplate(null);
      toast({
        title: "Template diupdate",
        description: "Template form berhasil diupdate",
      });
    } else {
      setTemplates(prev => [...prev, template]);
      toast({
        title: "Template disimpan",
        description: "Template form berhasil disimpan",
      });
    }

    setNewTemplate({ name: '', description: '', category: '', fields: [] });
  };

  const editTemplate = (template: FormTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      category: template.category,
      fields: template.fields
    });
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Template dihapus",
      description: "Template form berhasil dihapus",
    });
  };

  const generateFormCode = (template: FormTemplate) => {
    const fieldsCode = template.fields.map(field => {
      const validation = field.required ? 'required' : '';
      return `
        <div className="form-group">
          <Label htmlFor="${field.name}">${field.label}${field.required ? ' *' : ''}</Label>
          ${field.type === 'textarea' ? 
            `<Textarea id="${field.name}" name="${field.name}" ${validation} />` :
            field.type === 'select' ?
            `<Select name="${field.name}" ${validation}>
              ${field.options?.map(opt => `<option value="${opt}">${opt}</option>`).join('\n              ') || ''}
            </Select>` :
            `<Input id="${field.name}" name="${field.name}" type="${field.type}" ${validation} />`
          }
        </div>`;
    }).join('\n        ');

    return `
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const ${template.name.replace(/\s+/g, '')}Form = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">${template.name}</h2>
      <p className="text-gray-600">${template.description}</p>
      ${fieldsCode}
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ${template.name.replace(/\s+/g, '')}Form;`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Form Template Editor</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Template Builder */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTemplate ? 'Edit Template' : 'Buat Template Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="templateName">Nama Template</Label>
              <Input
                id="templateName"
                value={editingTemplate?.name || newTemplate.name}
                onChange={(e) => editingTemplate ? 
                  setEditingTemplate(prev => prev ? {...prev, name: e.target.value} : null) :
                  setNewTemplate(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Nama template"
              />
            </div>
            
            <div>
              <Label htmlFor="templateDescription">Deskripsi</Label>
              <Textarea
                id="templateDescription"
                value={editingTemplate?.description || newTemplate.description}
                onChange={(e) => editingTemplate ? 
                  setEditingTemplate(prev => prev ? {...prev, description: e.target.value} : null) :
                  setNewTemplate(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Deskripsi template"
              />
            </div>

            <div>
              <Label htmlFor="templateCategory">Kategori</Label>
              <Input
                id="templateCategory"
                value={editingTemplate?.category || newTemplate.category}
                onChange={(e) => editingTemplate ? 
                  setEditingTemplate(prev => prev ? {...prev, category: e.target.value} : null) :
                  setNewTemplate(prev => ({ ...prev, category: e.target.value }))
                }
                placeholder="Kategori template"
              />
            </div>

            {/* Add Field Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Tambah Field</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Nama Field</Label>
                    <Input
                      value={newField.name}
                      onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="fieldName"
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={newField.label}
                      onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="Label Field"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Tipe</Label>
                    <select 
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                      value={newField.type}
                      onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as FormField['type'] }))}
                    >
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="password">Password</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="textarea">Textarea</option>
                      <option value="select">Select</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="required"
                      checked={newField.required}
                      onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                    />
                    <Label htmlFor="required">Required</Label>
                  </div>
                </div>

                {newField.type === 'select' && (
                  <div>
                    <Label>Options (pisahkan dengan koma)</Label>
                    <Input
                      value={newField.options}
                      onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}

                <Button onClick={addField} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Field
                </Button>
              </div>
            </div>

            {/* Fields List */}
            {((editingTemplate?.fields || newTemplate.fields).length > 0) && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Fields dalam Template</h4>
                <div className="space-y-2">
                  {(editingTemplate?.fields || newTemplate.fields).map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{field.label}</span>
                        <Badge variant="outline" className="ml-2">{field.type}</Badge>
                        {field.required && <Badge variant="destructive" className="ml-1">Required</Badge>}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          if (editingTemplate) {
                            setEditingTemplate(prev => prev ? {
                              ...prev,
                              fields: prev.fields.filter(f => f.id !== field.id)
                            } : null);
                          } else {
                            setNewTemplate(prev => ({
                              ...prev,
                              fields: prev.fields.filter(f => f.id !== field.id)
                            }));
                          }
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={saveTemplate} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    {editingTemplate ? 'Update Template' : 'Simpan Template'}
                  </Button>
                  {editingTemplate && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditingTemplate(null);
                        setNewTemplate({ name: '', description: '', category: '', fields: [] });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{template.fields.length} fields</Badge>
                        <Badge>{template.category}</Badge>
                        <span className="text-xs text-gray-500">Created: {template.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => editTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const code = generateFormCode(template);
                          navigator.clipboard.writeText(code);
                          toast({
                            title: "Kode disalin",
                            description: "Kode React component berhasil disalin ke clipboard",
                          });
                        }}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {templates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Belum ada template yang dibuat
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormEditor;
