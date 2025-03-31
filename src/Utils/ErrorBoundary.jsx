import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          minH="100vh"
          p={8}
          textAlign="center"
        >
          <VStack spacing={6} align="center" maxW="800px" mx="auto">
            <Heading as="h1" size="xl">
              Oops! Something went wrong
            </Heading>
            <Text fontSize="lg">
              We're sorry, but there was an error loading this page. Please try refreshing or contact support if the problem persists.
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => window.location.reload()}
              size="lg"
            >
              Refresh Page
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Box mt={4} p={4} bg="gray.100" borderRadius="md" w="100%">
                <Text as="pre" fontSize="sm" whiteSpace="pre-wrap">
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 