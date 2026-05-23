import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generateIncidentReport = (employeeData) => {
    const doc = new jsPDF();

    // Set Document Properties
    doc.setProperties({
        title: `SOC_Incident_Report_EMP${employeeData.employee_id}`,
        subject: "Insider Threat Incident Report",
        creator: "Hybrid Insider Threat Detection System",
    });

    // Header
    doc.setFillColor(11, 15, 25); // Dark SOC background
    doc.rect(0, 0, doc.internal.pageSize.width, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SOC INCIDENT REPORT", 14, 20);

    // Subheader Details
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 40);
    doc.text(`Subject ID: EMP-${employeeData.employee_id}`, 14, 48);

    // Risk Level Badge Calculation
    const finalRisk = Number(employeeData.final_risk);
    let riskLevel = "SAFE";
    let riskColor = [16, 185, 129]; // Emerald Green

    if (finalRisk > 0.6) {
        riskLevel = "CRITICAL";
        riskColor = [220, 38, 38]; // Red
    } else if (finalRisk > 0.3) {
        riskLevel = "MODERATE";
        riskColor = [245, 158, 11]; // Amber
    }

    doc.text("Threat Level: ", 120, 48);
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text(riskLevel, 148, 48);

    // Line break
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 55, doc.internal.pageSize.width - 14, 55);

    // Summary AutoTable
    autoTable(doc, {
        startY: 65,
        head: [["Risk Vector", "Score", "Threshold Status"]],
        body: [
            [
                "Behavioral (File/Data Exfiltration)",
                Number(employeeData.behavior_score).toFixed(4),
                employeeData.behavior_score > 0.6 ? "Exceeded" : "Normal"
            ],
            [
                "NLP (Communications Sentiment)",
                Number(employeeData.nlp_score).toFixed(4),
                employeeData.nlp_score > 0.6 ? "Exceeded" : "Normal"
            ],
            [
                "Fused Final Risk",
                finalRisk.toFixed(4),
                finalRisk > 0.6 ? "CRITICAL BREACH" : finalRisk > 0.3 ? "Elevated" : "Monitored"
            ]
        ],
        theme: "striped",
        headStyles: { fillColor: [40, 50, 70], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { font: "helvetica", fontSize: 11 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: 14, right: 14 }
    });

    // Footer / Conclusion
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 150;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Analyst Conclusion & Remarks:", 14, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    let remark = "";
    if (finalRisk > 0.6) {
        remark = `Immediate action recommended. Subject EMP-${employeeData.employee_id} has exceeded the critical risk threshold (${finalRisk.toFixed(4)}). Both behavioral and communication patterns suggest imminent insider threat activity or policy violation.`;
    } else if (finalRisk > 0.3) {
        remark = `Subject EMP-${employeeData.employee_id} is displaying elevated behavioral or communication anomalies (${finalRisk.toFixed(4)}). Increased monitoring recommended. Verify permissions and access logs for the past 7 days.`;
    } else {
        remark = `Subject EMP-${employeeData.employee_id} remains within acceptable operational thresholds (${finalRisk.toFixed(4)}). Continue standard automated monitoring. No immediate SOC intervention required.`;
    }

    const splitRemark = doc.splitTextToSize(remark, doc.internal.pageSize.width - 28);
    doc.text(splitRemark, 14, finalY + 8);

    // Authentication Stamp
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const pageHeight = doc.internal.pageSize.height;
    doc.text("Generated securely by the Hybrid Insider Threat Detection System. Classified.", 14, pageHeight - 10);

    // Download
    doc.save(`SOC_Incident_Report_EMP_${employeeData.employee_id}.pdf`);
};

export const generateMasterReport = (allEmployeesData) => {
    const doc = new jsPDF();

    // Set Document Properties
    doc.setProperties({
        title: `SOC_Master_Threat_Report`,
        subject: "Master Insider Threat Roster",
        creator: "Hybrid Insider Threat Detection System",
    });

    // Header
    doc.setFillColor(11, 15, 25);
    doc.rect(0, 0, doc.internal.pageSize.width, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SOC MASTER THREAT ROSTER", 14, 20);

    // Subheader
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date Generated: ${new Date().toLocaleString()}`, 14, 40);

    const criticalCount = allEmployeesData.filter(e => e.final_risk > 0.6).length;
    doc.setTextColor(criticalCount > 0 ? 220 : 50, 50, 50);
    doc.text(`Critical Threats Detected: ${criticalCount}`, 120, 40);

    // Table Array Transformation
    const tableBody = allEmployeesData.map(emp => {
        let status = "SAFE";
        if (emp.final_risk > 0.6) status = "CRITICAL";
        else if (emp.final_risk > 0.3) status = "MODERATE";

        return [
            `EMP-${emp.employee_id}`,
            Number(emp.behavior_score).toFixed(4),
            Number(emp.nlp_score).toFixed(4),
            { content: Number(emp.final_risk).toFixed(4), styles: { fontStyle: 'bold' } },
            {
                content: status,
                styles: {
                    textColor: emp.final_risk > 0.6 ? [220, 38, 38] : emp.final_risk > 0.3 ? [245, 158, 11] : [16, 185, 129]
                }
            }
        ];
    });

    autoTable(doc, {
        startY: 50,
        head: [["Employee ID", "Behavior Score", "NLP Score", "Final Risk", "Status"]],
        body: tableBody,
        theme: "striped",
        headStyles: { fillColor: [40, 50, 70], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { font: "monospace", fontSize: 9 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated securely by the Hybrid Insider Threat Detection System. Classified.", 14, doc.internal.pageSize.height - 10);

    doc.save(`SOC_Master_Threat_Report.pdf`);
};
