from app.services.vector_service import vector_service

# Test searches
queries = [
    "What programs are available in USA for Computer Science?",
    "Tell me about scholarships for international students",
    "Which universities offer AI programs in Canada?",
    "What is the tuition fee for Stanford?",
]

for query in queries:
    print(f"\n{'='*80}")
    print(f"Query: {query}")
    print('='*80)
    
    results = vector_service.search(query, limit=3)
    
    for i, result in enumerate(results, 1):
        payload = result['payload']
        print(f"\n{i}. [{payload['type'].upper()}] Score: {result['score']:.4f}")
        
        if payload['type'] == 'program':
            print(f"   Program: {payload['program_name']}")
            print(f"   University: {payload['university']}")
        else:
            print(f"   Scholarship: {payload['scholarship_name']}")
            print(f"   Provider: {payload['provider']}")
        
        print(f"   Country: {payload['country']}")
    
    print()
