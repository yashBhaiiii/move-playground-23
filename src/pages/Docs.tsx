
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Docs = () => {
  return (
    <div className="container mx-auto pt-20 pb-10">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      <p className="text-gray-600 mb-8">
        Learn how to use the Smart Contract Builder efficiently with our comprehensive documentation.
      </p>

      <Tabs defaultValue="getting-started">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="nodes">Node Types</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="code">Code Generation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with Smart Contract Builder</CardTitle>
              <CardDescription>Learn the basics of creating smart contracts visually</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Introduction</h3>
              <p>
                Smart Contract Builder is a visual tool that allows you to design and generate smart contracts
                without writing code directly. By connecting different nodes representing contract components,
                you can create complex smart contracts visually.
              </p>
              
              <h3 className="text-lg font-medium">Basic Workflow</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create a new canvas or select a template</li>
                <li>Drag nodes from the sidebar onto the canvas</li>
                <li>Connect nodes to establish relationships</li>
                <li>Configure node properties by clicking on them</li>
                <li>Preview the generated code</li>
                <li>Save your work</li>
              </ol>
              
              <h3 className="text-lg font-medium">Interface Overview</h3>
              <p>
                The interface consists of a sidebar with node types, a canvas for building the contract visually,
                and a code preview panel that shows the generated smart contract code based on your visual design.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nodes">
          <Card>
            <CardHeader>
              <CardTitle>Node Types Reference</CardTitle>
              <CardDescription>Understand the different types of nodes available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Contract Node</h3>
                  <p className="text-sm text-gray-600">The main container for your smart contract. Every diagram should have at least one contract node.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Role Node</h3>
                  <p className="text-sm text-gray-600">Represents different roles or actors that interact with the contract.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Action Node</h3>
                  <p className="text-sm text-gray-600">Represents functions or operations that can be performed in the contract.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Observation Node</h3>
                  <p className="text-sm text-gray-600">Represents events or state observations that can trigger other actions.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Value Node</h3>
                  <p className="text-sm text-gray-600">Represents a value or parameter in the contract, such as an amount or identifier.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Bound Node</h3>
                  <p className="text-sm text-gray-600">Represents constraints or limits for values in the contract.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Token Node</h3>
                  <p className="text-sm text-gray-600">Represents different types of tokens that the contract interacts with.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Party Node</h3>
                  <p className="text-sm text-gray-600">Represents participants or counterparties in a contract relationship.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Working with Connections</CardTitle>
              <CardDescription>Learn how to create and manage relationships between nodes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Creating Connections</h3>
              <p>
                To create a connection between nodes, click and drag from a connection point (handle) of one node
                to a connection point of another node. Different connection types have different meanings in the 
                generated contract code.
              </p>
              
              <h3 className="text-lg font-medium">Connection Types</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Ownership:</strong> Connect a Role node to other nodes to indicate ownership or control</li>
                <li><strong>Interaction:</strong> Connect Action nodes to other nodes to create function relationships</li>
                <li><strong>Condition:</strong> Connect Observation nodes to Action nodes to create conditional logic</li>
                <li><strong>Parameter:</strong> Connect Value nodes to Action nodes to provide parameters for functions</li>
              </ul>
              
              <h3 className="text-lg font-medium">Managing Connections</h3>
              <p>
                You can delete a connection by selecting it and pressing the Delete key. To modify the relationship
                type, you may need to rearrange the nodes and create new connections.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Code Generation</CardTitle>
              <CardDescription>Understanding how visual diagrams translate to smart contract code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">How Code Generation Works</h3>
              <p>
                The system analyzes the nodes and connections on your canvas to generate corresponding 
                smart contract code. Different node types and their relationships are translated into
                specific code structures.
              </p>
              
              <h3 className="text-lg font-medium">Code Preview</h3>
              <p>
                The code preview panel shows the generated code in real-time as you make changes to your
                diagram. This allows you to see how your visual design translates into actual code.
              </p>
              
              <h3 className="text-lg font-medium">Supported Languages</h3>
              <p>
                Currently, the system generates code for the Move language used in the Aptos blockchain.
                Support for other languages and platforms may be added in the future.
              </p>
              
              <h3 className="text-lg font-medium">Customizing Generated Code</h3>
              <p>
                You can modify the generated code by adjusting the properties of your nodes and
                the relationships between them. For advanced customization, you may need to export
                the code and make manual adjustments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Docs;
