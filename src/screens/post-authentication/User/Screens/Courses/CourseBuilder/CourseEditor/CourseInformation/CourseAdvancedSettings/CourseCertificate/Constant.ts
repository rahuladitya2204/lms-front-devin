export const GetBaseCertificateTemplate = ({ logo }: any={logo:''}) => {
  return `
    <div class="certificate-container" style="padding: 50px; width: 1024px;">
        <div class="certificate" style="border: 20px solid #0C5280; padding: 25px; height: 600px; position: relative;">
            <div class="water-mark-overlay"></div>
            <div class="certificate-header">
                <img src="${
                  logo
                }" class="logo" alt="" style="width: 80px; height: 80px;" width="80" height="80">
            </div>
            <div class="certificate-body" style="text-align: center;">
               
                <p class="certificate-title" style="text-align: center;"><strong>RENR NCLEX AND CONTINUING EDUCATION (CME) Review Masters</strong></p>
                <h1 style="font-weight: 400; font-size: 48px; color: #0C5280;">Certificate of Completion</h1>
                <p class="student-name" style="font-size: 24px;">Matthew Taylor</p>
                <div class="certificate-content" style="margin: 0 auto; width: 750px;">
                    <div class="about-certificate" style="width: 380px; margin: 0 auto;">
                        <p>
                    has completed [hours] hours on topic title here online on Date [Date of Completion]
                    </p>
                    </div>
                    <p class="topic-title">
                        The Topic consists of [hours] Continuity hours and includes the following:
                    </p>
                    <div class="text-center">
                        <p class="topic-description text-muted" style="text-align: center;">Contract adminitrator - Types of claim - Claim Strategy - Delay analysis - Thepreliminaries to a claim - The essential elements to a successful claim - Responses - Claim preparation and presentation </p>
                    </div>
                </div>
                <div class="certificate-footer text-muted">
                    <div class="row">
                        <div class="col-md-6">
                            <p>Principal: ______________________</p>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-6">
                                    <p>
                                        Accredited by
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <p>
                                        Endorsed by
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}
