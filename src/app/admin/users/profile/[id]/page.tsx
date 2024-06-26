'use client';
import React, { useEffect, useState } from 'react';
import { UserDto } from '@/services/user/dto/user.dto';
import findOne from '@/services/user/findOne';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { translateUserTypes } from '@/utils';
import * as Switch from '@radix-ui/react-switch';
import updateUser from '@/services/user/update';
import { toast } from 'react-toastify';
import AdminLayout from '@/shared/layouts/adminLayout';
import { useRouter } from 'next/navigation';
import CertificateTable from '@/app/profile/certificates/components/certificateTable/CertificateTable';
import { CertificateDto } from '@/app/profile/certificates/models/certificate.model';
import CertificateForm from '@/app/profile/certificates/components/certificateForm/CertificateForm';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  params: { id: string };
}

const UserProfile: React.FC<Props> = ({ params }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [certificates, setCertificates] = useState<CertificateDto[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await findOne(params.id);
      if (response) {
        setUser(response);
        setActive(response.active);
        if (response.userAttributes?.certificates) {
          setCertificates(response.userAttributes?.certificates);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [params.id]);

  const getFullYear = (date: string): string => {
    const d = new Date(date);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  const _updateUser = async () => {
    try {
      setIsSubmitting(true);
      await updateUser(params.id, { active });
      toast('User profile updated', { type: 'success' });
    } catch (error) {
      toast('Something went wrong. Please try again', { type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCertificateDelete = ({ id }: CertificateDto) => {
    setCertificates(certificates.filter((c) => c.id !== id));
  };

  const onCertificateCreate = (certificate: CertificateDto) => {
    setCertificates([...certificates, certificate]);
  };

  if (isLoading) return <>Loading...</>;

  if (!user) return null;

  return (
    <AdminLayout headerChildren={<h1>Update user profile</h1>}>
      <div className="flex flex-col md:flex-row">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <p className="text-sm leading-none text-gray-500">
              Update user profile information.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={user.userAttributes.firstname}
                readOnly={true}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={user.userAttributes.lastname}
                readOnly={true}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={translateUserTypes(user.userAttributes.type)}
                readOnly={true}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Terms and Conditions accepted</Label>
              {user.termsAndConditionsAccepted ? (
                <CheckCircle2 color="#00ff04" />
              ) : (
                <XCircle color="#ff0000" />
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="active">Active</Label>
              <Switch.Root
                className="bg-blackA6 shadow-blackA4 relative h-[25px] w-[42px] cursor-pointer rounded-full shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
                id="active"
                checked={active}
                onCheckedChange={setActive}>
                <Switch.Thumb className="shadow-blackA4 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
              </Switch.Root>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Contact Information
              </h3>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  readOnly={true}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={user.userAttributes.phone}
                  readOnly={true}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={user.userAttributes.city}
                  readOnly={true}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Meta Information
              </h3>

              <div className="grid gap-2">
                <Label htmlFor="createdAt">Created at</Label>
                <Input
                  id="createdAt"
                  value={getFullYear(user.createdAt!).toString()}
                  readOnly={true}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="updatedAt">Updated at</Label>
                <Input
                  id="updatedAt"
                  value={getFullYear(user.updatedAt!)}
                  readOnly={true}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <Button size="sm" onClick={_updateUser} disabled={isSubmitting}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/admin/users')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle className="text-lg">Certificates</CardTitle>
            <p className="text-sm leading-none text-gray-500">
              List user attached certificates.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="mb-5">
              <CertificateForm
                userId={Number(params.id)}
                onCertificateCreate={onCertificateCreate}
              />
            </div>
            <div className="rounded-lg border shadow-sm">
              <CertificateTable
                certificates={certificates}
                onCertificateDelete={onCertificateDelete}
                allowedActions={['delete', 'download', 'update']}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserProfile;
