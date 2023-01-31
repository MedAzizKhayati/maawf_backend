import { pki } from 'node-forge';
import { User } from './entities/user.entity';

export class CryptoService {
  public generatedRsaKeyPair() {
    const keys = pki.rsa.generateKeyPair(512);
    return keys;
  }

  public createSelfSignedCertificate(user: User) {
    const keys = this.generatedRsaKeyPair();
    const cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 3);
    const attrs = [
      {
        name: 'commonName',
        value: user.email,
      },
    ];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);
    return cert;
  }

  public createCertificateFromCertificationRequest(
    csrPem: string,
    authority: pki.Certificate,
    authorityKey: pki.rsa.PrivateKey,
  ) {
    const csr = pki.certificationRequestFromPem(csrPem);
    const cert = pki.createCertificate();
    cert.publicKey = csr.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 3);
    cert.setSubject(csr.subject.attributes);
    cert.setIssuer(authority.subject.attributes);
    cert.sign(authorityKey);
    return cert;
  }

  public verifyCSR(csrPem: string, publicKeyPem: string) {
    const csr = pki.certificationRequestFromPem(csrPem);
    return pki.publicKeyToPem(csr.publicKey) === publicKeyPem;
  }

  public certToPem(cert: pki.Certificate) {
    return pki.certificateToPem(cert);
  }

  public pemToCert(pem: string) {
    return pki.certificateFromPem(pem);
  }

  public isCertificateValid(cert: pki.Certificate, authority: pki.Certificate) {
    const caStore = pki.createCaStore([authority]);
    return pki.verifyCertificateChain(caStore, [cert]);
  }
}
