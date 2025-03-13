
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, MessageSquare, Users } from "lucide-react";

const Community = () => {
  return (
    <div className="container mx-auto pt-20 pb-10">
      <h1 className="text-3xl font-bold mb-6">Community</h1>
      <p className="text-gray-600 mb-8">
        Join our growing community of smart contract developers, share your work, and get help from others.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Discussion Forum
            </CardTitle>
            <CardDescription>
              Ask questions, share ideas, and discuss smart contract development with the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our forum is the perfect place to get help with your smart contract designs, 
              share your templates, and learn from other developers' experiences.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Visit Forum
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Github className="mr-2 h-5 w-5" />
              GitHub Repository
            </CardTitle>
            <CardDescription>
              Contribute to the Smart Contract Builder or report issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The Smart Contract Builder is an open-source project. Visit our GitHub repository
              to contribute, report bugs, or suggest new features.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Visit Repository
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Smart Contract Workshop</CardTitle>
            <CardDescription>July 15, 2024 • Virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Learn how to design and implement secure smart contracts with our expert instructors.
              This hands-on workshop will cover best practices and common patterns.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Register</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DeFi Contract Deep Dive</CardTitle>
            <CardDescription>August 5, 2024 • Virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Explore the intricacies of DeFi contract design, including liquidity pools,
              staking mechanisms, and yield farming strategies.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Register</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart Contract Security</CardTitle>
            <CardDescription>September 10, 2024 • Virtual</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Learn to identify and mitigate common security vulnerabilities in smart contracts
              with our security experts. Includes audit techniques and tools.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">Register</Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Featured Community Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>NFT Marketplace Template</CardTitle>
            <CardDescription>By CryptoCreative</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              A comprehensive template for building NFT marketplaces with
              advanced features like royalties, auctions, and offers.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Project</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>DAO Tooling Suite</CardTitle>
            <CardDescription>By GovernanceGuru</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              A collection of templates and tools for creating and managing
              decentralized autonomous organizations.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Project</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Vesting Framework</CardTitle>
            <CardDescription>By TokenomicsTeam</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              A flexible framework for implementing token vesting schedules
              with customizable release mechanisms.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Project</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Community;
