// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";
// import { toast } from "sonner";

// import {
//   Mail,
//   Phone,
//   User,
//   BriefcaseBusiness,
//   Plus,
//   Loader2,
// } from "lucide-react";

// import { organizationApi } from "../api/organization.api";

// import {
//   contactPersonSchema,
//   ContactPersonFormValues,
// } from "../schemas/organization.schema";

// import { queryKeys } from "@/lib/query/query-keys";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import {
//   Alert,
//   AlertDescription,
// } from "@/components/ui/alert";

// interface AddContactPersonDialogProps {
//   organizationId: string;
// }

// export function AddContactPersonDialog({
//   organizationId,
// }: AddContactPersonDialogProps) {
//   const [open, setOpen] = useState(false);

//   const queryClient = useQueryClient();

//   const form =
//     useForm<ContactPersonFormValues>({
//       resolver: zodResolver(
//         contactPersonSchema
//       ),

//       defaultValues: {
//         name: "",
//         designation: "",
//         contactEmail: "",
//         contactPhone: "",
//       },

//       mode: "onBlur",
//     });

//   /* ================================================= */
//   /* ADD CONTACT MUTATION */
//   /* ================================================= */

//   const addContactMutation =
//     useMutation({
//       mutationFn: (
//         values: ContactPersonFormValues
//       ) =>
//         organizationApi.addContactPerson(
//           organizationId,
//           {
//             name: values.name.trim(),
//             designation:
//               values.designation?.trim() ||
//               undefined,
//             contactEmail:
//               values.contactEmail?.trim() ||
//               undefined,
//             contactPhone:
//               values.contactPhone?.trim() ||
//               undefined,
//           }
//         ),

//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey:
//             queryKeys.organizations.contacts(
//               organizationId
//             ),
//         });

//         toast.success(
//           "Contact person added successfully."
//         );

//         form.reset();

//         setOpen(false);
//       },

//       onError: (error: Error) => {
//         toast.error(
//           error.message ||
//             "Failed to add contact person."
//         );
//       },
//     });

//   /* ================================================= */
//   /* SUBMIT */
//   /* ================================================= */

//   const onSubmit = (
//     values: ContactPersonFormValues
//   ) => {
//     if (!organizationId) {
//       return;
//     }

//     addContactMutation.mutate(values);
//   };

//   /* ================================================= */
//   /* DIALOG STATE */
//   /* ================================================= */

//   const handleOpenChange = (
//     nextOpen: boolean
//   ) => {
//     if (
//       addContactMutation.isPending &&
//       !nextOpen
//     ) {
//       return;
//     }

//     if (!nextOpen) {
//       form.reset();
//     }

//     setOpen(nextOpen);
//   };

//   /* ================================================= */
//   /* CANCEL */
//   /* ================================================= */

//   const handleCancel = () => {
//     if (addContactMutation.isPending) {
//       return;
//     }

//     form.reset();

//     setOpen(false);
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={handleOpenChange}
//     >

//       {/* ================================================= */}
//       {/* TRIGGER */}
//       {/* ================================================= */}

//       <DialogTrigger asChild>

//         <Button>

//           <Plus className="mr-2 h-4 w-4" />

//           Add Contact

//         </Button>

//       </DialogTrigger>

//       {/* ================================================= */}
//       {/* DIALOG */}
//       {/* ================================================= */}

//       <DialogContent className="sm:max-w-[560px]">

//         {/* ================================================= */}
//         {/* HEADER */}
//         {/* ================================================= */}

//         <DialogHeader>

//           <div className="flex items-center gap-3">

//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">

//               <User className="h-4 w-4 text-primary" />

//             </div>

//             <div>

//               <DialogTitle>
//                 Add Contact Person
//               </DialogTitle>

//               <DialogDescription>
//                 Add a person associated with this
//                 organization.
//               </DialogDescription>

//             </div>

//           </div>

//         </DialogHeader>

//         {/* ================================================= */}
//         {/* ERROR */}
//         {/* ================================================= */}

//         {addContactMutation.isError && (
//           <Alert variant="destructive">

//             <AlertDescription>
//               {addContactMutation.error instanceof
//               Error
//                 ? addContactMutation.error.message
//                 : "Unable to add contact person. Please try again."}
//             </AlertDescription>

//           </Alert>
//         )}

//         {/* ================================================= */}
//         {/* FORM */}
//         {/* ================================================= */}

//         <Form {...form}>

//           <form
//             onSubmit={form.handleSubmit(
//               onSubmit
//             )}
//             className="space-y-6"
//           >

//             {/* ================================================= */}
//             {/* CONTACT INFORMATION */}
//             {/* ================================================= */}

//             <div className="space-y-4">

//               <div className="border-b pb-3">

//                 <h3 className="text-sm font-semibold">
//                   Contact Information
//                 </h3>

//                 <p className="mt-1 text-xs text-muted-foreground">
//                   Enter the contact person&apos;s
//                   basic information.
//                 </p>

//               </div>

//               {/* ================================================= */}
//               {/* NAME */}
//               {/* ================================================= */}

//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>

//                     <FormLabel>
//                       Full Name
//                       <span className="ml-1 text-destructive">
//                         *
//                       </span>
//                     </FormLabel>

//                     <FormControl>

//                       <div className="relative">

//                         <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                         <Input
//                           {...field}
//                           disabled={
//                             addContactMutation.isPending
//                           }
//                           className="pl-9"
//                           placeholder="e.g. John Doe"
//                           autoComplete="name"
//                         />

//                       </div>

//                     </FormControl>

//                     <FormMessage />

//                   </FormItem>
//                 )}
//               />

//               {/* ================================================= */}
//               {/* DESIGNATION */}
//               {/* ================================================= */}

//               <FormField
//                 control={form.control}
//                 name="designation"
//                 render={({ field }) => (
//                   <FormItem>

//                     <FormLabel>
//                       Designation
//                     </FormLabel>

//                     <FormControl>

//                       <div className="relative">

//                         <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                         <Input
//                           {...field}
//                           disabled={
//                             addContactMutation.isPending
//                           }
//                           className="pl-9"
//                           placeholder="e.g. HR Manager"
//                           autoComplete="organization-title"
//                         />

//                       </div>

//                     </FormControl>

//                     <FormMessage />

//                   </FormItem>
//                 )}
//               />

//               {/* ================================================= */}
//               {/* EMAIL + PHONE */}
//               {/* ================================================= */}

//               <div className="grid gap-4 sm:grid-cols-2">

//                 {/* EMAIL */}

//                 <FormField
//                   control={form.control}
//                   name="contactEmail"
//                   render={({ field }) => (
//                     <FormItem>

//                       <FormLabel>
//                         Email Address
//                       </FormLabel>

//                       <FormControl>

//                         <div className="relative">

//                           <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                           <Input
//                             {...field}
//                             type="email"
//                             disabled={
//                               addContactMutation.isPending
//                             }
//                             className="pl-9"
//                             placeholder="john@company.com"
//                             autoComplete="email"
//                           />

//                         </div>

//                       </FormControl>

//                       <FormMessage />

//                     </FormItem>
//                   )}
//                 />

//                 {/* PHONE */}

//                 <FormField
//                   control={form.control}
//                   name="contactPhone"
//                   render={({ field }) => (
//                     <FormItem>

//                       <FormLabel>
//                         Phone Number
//                       </FormLabel>

//                       <FormControl>

//                         <div className="relative">

//                           <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//                           <Input
//                             {...field}
//                             type="tel"
//                             disabled={
//                               addContactMutation.isPending
//                             }
//                             className="pl-9"
//                             placeholder="+91 9876543210"
//                             autoComplete="tel"
//                           />

//                         </div>

//                       </FormControl>

//                       <FormMessage />

//                     </FormItem>
//                   )}
//                 />

//               </div>

//             </div>

//             {/* ================================================= */}
//             {/* FOOTER */}
//             {/* ================================================= */}

//             <DialogFooter className="gap-2 sm:gap-0">

//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={
//                   addContactMutation.isPending
//                 }
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="submit"
//                 disabled={
//                   addContactMutation.isPending ||
//                   !form.formState.isDirty
//                 }
//               >

//                 {addContactMutation.isPending ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Contact Person
//                   </>
//                 )}

//               </Button>

//             </DialogFooter>

//           </form>

//         </Form>

//       </DialogContent>

//     </Dialog>
//   );
// }