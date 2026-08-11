// 'use client';

// import { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from 'sonner';

// import { organizationApi } from '../api/organization.api';
// import { queryKeys } from '@/lib/query/query-keys';

// import {
//   contactPersonSchema,
//   ContactPersonFormValues,
// } from '../schemas/organization.schema';

// import { ContactPerson } from '../types/organization.types';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';

// interface EditContactPersonDialogProps {
//   organizationId: string;
//   contact: ContactPerson | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function EditContactPersonDialog({
//   organizationId,
//   contact,
//   open,
//   onOpenChange,
// }: EditContactPersonDialogProps) {
//   const queryClient = useQueryClient();

//   const form = useForm<ContactPersonFormValues>({
//     resolver: zodResolver(contactPersonSchema),

//     defaultValues: {
//       name: '',
//       designation: '',
//       contactEmail: '',
//       contactPhone: '',
//     },
//   });

//   /*
//    * Load selected contact person details
//    * into the form whenever contact changes.
//    */
//   useEffect(() => {
//     if (contact) {
//       form.reset({
//         name: contact.name ?? '',
//         designation: contact.designation ?? '',
//         contactEmail: contact.contactEmail ?? '',
//         contactPhone: contact.contactPhone ?? '',
//       });
//     }
//   }, [contact, form]);

//   const updateContactMutation = useMutation({
//     mutationFn: (values: ContactPersonFormValues) =>
//       organizationApi.updateContactPerson(
//         organizationId,
//         contact!.id,
//         {
//           name: values.name,
//           designation: values.designation,
//           contactEmail: values.contactEmail || undefined,
//           contactPhone: values.contactPhone || undefined,
//         }
//       ),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey:
//           queryKeys.organizations.contacts(organizationId),
//       });

//       toast.success(
//         'Contact person updated successfully'
//       );

//       form.reset();

//       onOpenChange(false);
//     },

//     onError: (error: Error) => {
//       toast.error(
//         error.message ||
//           'Failed to update contact person'
//       );
//     },
//   });

//   const onSubmit = (
//     values: ContactPersonFormValues
//   ) => {
//     if (!contact) return;

//     updateContactMutation.mutate(values);
//   };

//   const handleOpenChange = (value: boolean) => {
//     if (
//       !value &&
//       !updateContactMutation.isPending
//     ) {
//       form.reset();
//     }

//     onOpenChange(value);
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={handleOpenChange}
//     >
//       <DialogContent className="sm:max-w-[500px]">

//         <DialogHeader>
//           <DialogTitle>
//             Edit Contact Person
//           </DialogTitle>

//           <DialogDescription>
//             Update the contact person's information
//             associated with this organization.
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-5"
//           >

//             {/* Full Name */}
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Full Name{' '}
//                     <span className="text-destructive">
//                       *
//                     </span>
//                   </FormLabel>

//                   <FormControl>
//                     <Input
//                       placeholder="Enter full name"
//                       disabled={
//                         updateContactMutation.isPending
//                       }
//                       {...field}
//                     />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Designation */}
//             <FormField
//               control={form.control}
//               name="designation"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Designation
//                   </FormLabel>

//                   <FormControl>
//                     <Input
//                       placeholder="e.g. HR Manager"
//                       disabled={
//                         updateContactMutation.isPending
//                       }
//                       {...field}
//                     />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Email */}
//             <FormField
//               control={form.control}
//               name="contactEmail"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Email Address
//                   </FormLabel>

//                   <FormControl>
//                     <Input
//                       type="email"
//                       placeholder="name@company.com"
//                       disabled={
//                         updateContactMutation.isPending
//                       }
//                       {...field}
//                     />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Phone */}
//             <FormField
//               control={form.control}
//               name="contactPhone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>
//                     Phone Number
//                   </FormLabel>

//                   <FormControl>
//                     <Input
//                       type="tel"
//                       placeholder="+1 555 123 4567"
//                       disabled={
//                         updateContactMutation.isPending
//                       }
//                       {...field}
//                     />
//                   </FormControl>

//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Actions */}
//             <DialogFooter>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() =>
//                   handleOpenChange(false)
//                 }
//                 disabled={
//                   updateContactMutation.isPending
//                 }
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="submit"
//                 disabled={
//                   updateContactMutation.isPending ||
//                   !contact
//                 }
//               >
//                 {updateContactMutation.isPending
//                   ? 'Saving...'
//                   : 'Save Changes'}
//               </Button>

//             </DialogFooter>

//           </form>
//         </Form>

//       </DialogContent>
//     </Dialog>
//   );
// }