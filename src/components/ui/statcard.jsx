import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../../components/ui/shadcn-card';
import { Skeleton } from 'antd';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  iconClassName, 
  className, 
  trend, 
  trendValue, 
  loading 
}) => {
  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } }
  };

  const contentVariants = {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3, delay: 0.1 } }
  };

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <Skeleton active paragraph={{ rows: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <motion.p 
              className="text-sm text-muted-foreground"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              {title}
            </motion.p>
            <motion.div 
              className="flex items-baseline space-x-2"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <span className="text-2xl font-bold">{value}</span>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend === 'up' ? 'text-green-500' : 'text-red-500'
                )}>
                  {trend === 'up' ? '↑' : '↓'} {trendValue}
                </span>
              )}
            </motion.div>
            {description && (
              <motion.p 
                className="text-xs text-muted-foreground"
                variants={contentVariants}
                initial="initial"
                animate="animate"
              >
                {description}
              </motion.p>
            )}
          </div>
          {Icon && (
            <motion.div
              variants={iconVariants}
              initial="initial"
              animate="animate"
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center",
                iconClassName
              )}
            >
              <Icon size={22} />
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
