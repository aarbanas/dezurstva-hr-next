import {
  APIs,
  deleteRequest,
  get,
  post,
  patch,
} from '@/shared/http-service/httpService';
import {
  CertificateDto,
  CreateCertificateDto,
} from '../models/certificate.model';
import { CertificateTypeEnum } from '@/app/profile/certificates/enums/certificate-types.enum';

const fetchCertificates = async (userId: number): Promise<CertificateDto[]> => {
  return get<CertificateDto[]>(`${APIs.CERTIFICATE}?userId=${userId}`);
};

const createCertificate = async (
  certificate: CreateCertificateDto
): Promise<CertificateDto> => {
  const requestUrl = `${APIs.CERTIFICATE}/${certificate.userId ? 'create-on-behalf-of' : ''}`;

  return post(requestUrl, certificate);
};

const updateStatus = async (certificateId: number, status: boolean) => {
  const requestUrl = `${APIs.CERTIFICATE}/${certificateId}`;

  return patch(requestUrl, { active: status });
};

const downloadCertificate = async (certificateId: number) => {
  const certificateURL = await get<string>(
    `${APIs.CERTIFICATE_FILES}/${certificateId}/download`
  );

  const response = await fetch(certificateURL);
  const certificate = await response.arrayBuffer();

  const contentType = response.headers.get('Content-Type') || '';
  const blob = new Blob([certificate], {
    type: contentType,
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `certificate`;
  a.click();
};

const deleteCertificate = async (certificateId: number) => {
  await deleteRequest(`${APIs.CERTIFICATE}/${certificateId}`);
};

const notifyUser = async (
  userId: number,
  certificateType: CertificateTypeEnum
) => {
  const requestUrl = `${APIs.CERTIFICATE}/notify/${userId}`;

  return post(requestUrl, { certificateType });
};

export {
  fetchCertificates,
  updateStatus,
  createCertificate,
  downloadCertificate,
  deleteCertificate,
  notifyUser,
};
