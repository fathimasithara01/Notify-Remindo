// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//   useAddContactPerson,
//   useUpdateContactPerson,
//   useRemoveContactPerson,
// } from '../hooks/useContactPersonMutations';
// import { contactPersonSchema, ContactPersonFormValues } from '../schemas/organization.schema';
// import { ContactPerson } from '../types/organization.types';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { ConfirmDialog } from '@/components/common/ConfirmDialog';
// import { EmptyState } from '@/components/common/EmptyState';
// import { Plus, Pencil, Trash2 } from 'lucide-react';

// function ContactPersonDialog({
//   organizationId,
//   contact,
//   trigger,
// }: {
//   organizationId: string;
//   contact?: ContactPerson;
//   trigger: React.ReactNode;
// }) {
//   const [open, setOpen] = useState(false);
//   const addMutation = useAddContactPerson(organizationId);
//   const updateMutation = useUpdateContactPerson(organizationId);

//   const form = useForm<ContactPersonFormValues>({
//     resolver: zodResolver(contactPersonSchema),
//     defaultValues: {
//       name: contact?.name ?? '',
//       designation: contact?.designation ?? '',
//       phone: contact?.phone ?? '',
//       email: contact?.email ?? '',
//     },
//   });

//   const onSubmit = (values: ContactPersonFormValues) => {
//     const mutation = contact
//       ? updateMutation.mutateAsync({ contactId: contact.id, payload: values })
//       : addMutation.mutateAsync(values);

//     mutation.then(() => {
//       setOpen(false);
//       form.reset();
//     });
//   };

//   const isPending = addMutation.isPending || updateMutation.isPending;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{contact ? 'Edit Contact Person' : 'Add Contact Person'}</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="designation"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Designation (optional)</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone (optional)</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email (optional)</FormLabel>
//                   <FormControl>
//                     <Input type="email" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogFooter>
//               <Button type="submit" disabled={isPending}>
//                 {isPending ? 'Saving…' : contact ? 'Save Changes' : 'Add Contact'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export function ContactPersonList({
//   organizationId,
//   contacts,
// }: {
//   organizationId: string;
//   contacts: ContactPerson[];
// }) {
//   const removeMutation = useRemoveContactPerson(organizationId);

//   return (
//     <div className="space-y-3">
//       <div className="flex justify-end">
//         <ContactPersonDialog
//           organizationId={organizationId}
//           trigger={
//             <Button size="sm">
//               <Plus className="mr-2 h-3.5 w-3.5" />
//               Add Contact
//             </Button>
//           }
//         />
//       </div>

//       {contacts.length === 0 ? (
//         <EmptyState title="No contact persons added yet." />
//       ) : (
//         <ul className="space-y-3">
//           {contacts.map((contact) => (
//             <li
//               key={contact.id}
//               className="flex items-start justify-between gap-2 rounded-md border p-3 text-sm"
//             >
//               <div>
//                 <p className="font-medium">{contact.name}</p>
//                 <p className="text-muted-foreground">
//                   {contact.designation && `${contact.designation} · `}
//                   {contact.phone}
//                   {contact.email && ` · ${contact.email}`}
//                 </p>
//               </div>
//               <div className="flex shrink-0 gap-1">
//                 <ContactPersonDialog
//                   organizationId={organizationId}
//                   contact={contact}
//                   trigger={
//                     <Button variant="ghost" size="sm">
//                       <Pencil className="h-3.5 w-3.5" />
//                     </Button>
//                   }
//                 />
//                 <ConfirmDialog
//                   trigger={
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="text-destructive hover:text-destructive"
//                     >
//                       <Trash2 className="h-3.5 w-3.5" />
//                     </Button>
//                   }
//                   title="Remove this contact?"
//                   description={`"${contact.name}" will be removed from this organization.`}
//                   onConfirm={() => removeMutation.mutate(contact.id)}
//                   isPending={removeMutation.isPending}
//                 />
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }