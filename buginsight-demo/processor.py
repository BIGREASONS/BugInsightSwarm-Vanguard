def process_telemetry_batch(batch_data):
    """Processes a batch of telemetry events.
    
    WARNING: Contains a Null Pointer / KeyError bug!
    """
    processed = []
    
    for event in batch_data:
        # BUG: Fails if 'metadata' is missing or None
        # Should be: device_id = event.get('metadata', {}).get('device_id', 'unknown')
        device_id = event['metadata']['device_id']
        
        # Process the event
        processed.append({
            "device": device_id,
            "status": "processed",
            "timestamp": event.get("timestamp")
        })
        
    return processed
