// lib/csvUtils.ts
export const downloadCSV = (data: any[], headers: string[], filename: string) => {
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(field =>
                `"${String(row[field] || '').replace(/"/g, '""')}"`
            ).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const readCSV = (file: File): Promise<{ data: any[], errors: string[] }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const errors: string[] = [];

        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const lines = content.split('\n');
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const data = [];

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;

                    const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    const row: any = {};

                    for (let j = 0; j < headers.length; j++) {
                        if (j >= values.length) {
                            row[headers[j]] = '';
                            continue;
                        }
                        row[headers[j]] = values[j].trim().replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
                    }

                    data.push(row);
                }

                resolve({ data, errors });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
    });
};