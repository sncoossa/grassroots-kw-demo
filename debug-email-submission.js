// Debug script to test Supabase connection and environment variables
import { createClient } from "@supabase/supabase-js";

async function testSupabaseConnection() {
  console.log("=== Supabase Connection Test ===");
  
  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log("SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
  console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceRoleKey ? "✓ Set" : "✗ Missing");
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Missing required environment variables");
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Test basic connection
    console.log("\n=== Testing Database Connection ===");
    const { data, error } = await supabase.from("waitlist_emails").select("count", { count: "exact", head: true });
    
    if (error) {
      console.error("Database connection error:", error);
    } else {
      console.log("✓ Database connection successful");
      console.log("Current email count:", data);
    }
    
    // Test table structure
    console.log("\n=== Testing Table Structure ===");
    const { data: tableData, error: tableError } = await supabase
      .from("waitlist_emails")
      .select("*")
      .limit(1);
      
    if (tableError) {
      console.error("Table access error:", tableError);
    } else {
      console.log("✓ Table access successful");
    }
    
  } catch (error) {
    console.error("Connection test failed:", error);
  }
}

testSupabaseConnection().catch(console.error);
