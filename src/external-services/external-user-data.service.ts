// src/external-services/external-user-data.service.ts
export class ExternalUserDataService {
    async fetchUsers(): Promise<any[]> {
        // Simulate an HTTP call to an external service
        return fetch('https://dummyjson.com/users')
        .then(res => res.json())
        return Promise.resolve([
            {
                id: 3,
                name: 'External User',
                email: 'external@example.com'
            }
        ]);
    }
}